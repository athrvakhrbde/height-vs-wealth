// Global variables
let data = [];

// DOM elements
const chartCanvas = document.getElementById('wealthChart');
const pieChartCanvas = document.getElementById('pieChart');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting application...');
    loadCSVData();
    
    // Initialize success calculator
    initializeSuccessCalculator();
});

// Load data (CSV for local, embedded for production)
function loadCSVData() {
    console.log('Loading data...');
    
    try {
        // Check if we're in production (Vercel) or local development
        const isProduction = window.location.hostname !== 'localhost' && 
                           window.location.hostname !== '127.0.0.1' &&
                           !window.location.hostname.includes('localhost');
        
        if (isProduction && window.embeddedData) {
            // Use embedded data for production
            console.log('Using embedded data for production');
            processData(window.embeddedData);
        } else {
            // Use CSV for local development
            console.log('Loading CSV data for local development');
            Papa.parse('famous_wealthy_people.csv', {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    console.log('CSV parsing complete, rows:', results.data.length);
                    processData(results.data);
                },
                error: function(error) {
                    console.error('Error parsing CSV:', error);
                    // Fallback to embedded data if CSV fails
                    if (window.embeddedData) {
                        console.log('Falling back to embedded data');
                        processData(window.embeddedData);
                    } else {
                        showError('Failed to load data. Please refresh the page.');
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading data:', error);
        // Final fallback to embedded data
        if (window.embeddedData) {
            console.log('Using embedded data as fallback');
            processData(window.embeddedData);
        } else {
            showError('Failed to load data. Please check if the data file exists.');
        }
    }
}

// Process data (common function for both CSV and embedded data)
function processData(rawData) {
    // Process and filter data
    data = rawData
        .map(row => {
            const height_cm = parseFloat(row.Height_cm);
            const height_ft = Math.round((height_cm / 30.48) * 100) / 100;
            const wealth = parseFloat(row.Net_Worth_USD);
            
            return {
                name: row.Name || 'Unknown',
                wealth: wealth,
                height: height_ft,
                status: row.Status || 'Unknown',
                source: row.Source_of_Wealth || 'Unknown'
            };
        })
        .filter(person => 
            person.wealth > 0 && 
            person.height >= 4.9 && 
            person.height <= 6.9 &&
            person.name !== 'Unknown'
        );
    
    console.log(`✅ Loaded ${data.length} valid records`);
    console.log('Sample data:', data.slice(0, 3));
    
    if (data.length === 0) {
        console.error('No valid data found');
        showError('No valid data found.');
        return;
    }
    
    initializeChart();
    initializePieChart();
}

// Simple wealth density calculation
function calculateWealthDensity(data) {
    // Group people by height (0.1ft bins)
    const heightGroups = {};
    
    data.forEach(person => {
        const heightBin = Math.round(person.height * 10) / 10; // Round to 0.1ft
        if (!heightGroups[heightBin]) {
            heightGroups[heightBin] = { people: [], totalWealth: 0 };
        }
        heightGroups[heightBin].people.push(person);
        heightGroups[heightBin].totalWealth += person.wealth;
    });
    
    // Find max wealth for normalization
    const maxWealth = Math.max(...Object.values(heightGroups).map(group => group.totalWealth));
    
    // Create density map and top names for each height
    const densityMap = {};
    const topNamesByHeight = {};
    
    Object.keys(heightGroups).forEach(height => {
        densityMap[height] = heightGroups[height].totalWealth / maxWealth;
        
        // Get top 3 wealthiest people at this height
        const top3 = heightGroups[height].people
            .sort((a, b) => b.wealth - a.wealth)
            .slice(0, 3)
            .map(person => person.name);
        
        topNamesByHeight[height] = top3;
    });
    
    console.log('📊 Wealth density calculated:');
    console.log('Max wealth:', maxWealth);
    console.log('Top 3 wealthiest heights:', Object.entries(densityMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3));
    
    return { densityMap, heightGroups, maxWealth, topNamesByHeight };
}

// Create wealth density heatmap background plugin
const wealthDensityHeatmapPlugin = {
    id: 'wealthDensityHeatmap',
    beforeDraw: function(chart) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const scales = chart.scales;
        
        if (!chartArea || !scales.x || !scales.y || !globalWealthData) return;
        
        // Create vertical gradient based on height wealth density
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        
        // Get all height bins and their wealth densities
        const heightBins = Object.entries(globalWealthData.densityMap)
            .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
        
        // Create gradient stops based on actual data
        heightBins.forEach(([height, density]) => {
            const heightValue = parseFloat(height);
            const yPosition = scales.y.getPixelForValue(heightValue);
            const normalizedY = (yPosition - chartArea.top) / (chartArea.bottom - chartArea.top);
            
            // Create color based on wealth density: green → yellow → orange → red
            const hue = Math.floor((1 - density) * 60); // 60 (green) to 0 (red)
            const saturation = 85 + (density * 15);
            const lightness = 45 + (density * 15);
            
            gradient.addColorStop(normalizedY, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.2)`);
        });
        
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
        ctx.restore();
    }
};

// Initialize main scatter plot chart
function initializeChart() {
    console.log('🎯 Initializing chart with', data.length, 'data points...');
    
    if (!chartCanvas) {
        console.error('Chart canvas not found');
        showError('Chart canvas not found. Please refresh the page.');
        return;
    }
    
    const ctx = chartCanvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context from canvas');
        showError('Could not initialize chart. Please refresh the page.');
        return;
    }
    
    // Calculate wealth density
    const wealthData = calculateWealthDensity(data);
    
    // Store globally for success calculator
    globalWealthData = wealthData;
    
    // Create heatmap dataset with proper color gradient
    const chartData = data.map(person => {
        const heightBin = Math.round(person.height * 10) / 10;
        const wealthDensity = wealthData.densityMap[heightBin] || 0;
        
        // Create HSL color based on wealth density: green → yellow → orange → red
        // Use HSL for better color transitions
        const hue = Math.floor((1 - wealthDensity) * 60); // 60 (green) to 0 (red)
        const saturation = 85 + (wealthDensity * 15); // 85% to 100% saturation
        const lightness = 45 + (wealthDensity * 15); // 45% to 60% lightness
        
        // Debug specific heights
        if (person.height >= 5.6 && person.height <= 5.7) {
            console.log(`🎯 ${person.name} at ${person.height}ft: density=${wealthDensity.toFixed(4)}, hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }
        
        return {
            x: person.wealth,
            y: person.height,
            name: person.name,
            status: person.status,
            source: person.source,
            backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            borderColor: `hsl(${hue}, ${Math.min(100, saturation + 10)}%, ${Math.max(40, lightness - 5)}%)`
        };
    });
    
    console.log('📊 Chart data created with individual colors');
    
    // Create the chart
    try {
        window.wealthChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: '',
                    data: chartData,
                    backgroundColor: chartData.map(point => point.backgroundColor),
                    borderColor: chartData.map(point => point.borderColor),
                    borderWidth: 1,
                    pointRadius: 4,
                    pointHoverRadius: 8,
                    pointBorderWidth: 1,
                    showLine: false,
                    tension: 0,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1.5,
                plugins: {
                    wealthDensityHeatmapPlugin,
                    title: {
                        display: true,
                        text: 'Height vs. Wealth',
                        color: '#ffffff',
                        font: {
                            size: 24,
                            weight: 'bold',
                            family: "'Helvetica Neue', Helvetica, Arial, sans-serif"
                        },
                        padding: 20
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    x: {
                        type: 'logarithmic',
                        title: {
                            display: true,
                            text: 'Net Worth (USD)',
                            color: '#ffffff',
                            font: {
                                size: 16,
                                weight: 'bold',
                                family: "'Helvetica Neue', Helvetica, Arial, sans-serif"
                            }
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.9)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            callback: function(value) {
                                if (value >= 1000000000) {
                                    return '$' + (value / 1000000000).toFixed(0) + 'B';
                                } else if (value >= 1000000) {
                                    return '$' + (value / 1000000).toFixed(0) + 'M';
                                } else if (value >= 1000) {
                                    return '$' + (value / 1000).toFixed(0) + 'K';
                                } else {
                                    return '$' + value.toFixed(0);
                                }
                            },
                            maxTicksLimit: 8
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        min: 10000,
                        max: 1000000000000
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Height (ft)',
                            color: '#ffffff',
                            font: {
                                size: 16,
                                weight: 'bold',
                                family: "'Helvetica Neue', Helvetica, Arial, sans-serif"
                            }
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.9)',
                           font: {
                               size: 12,
                               weight: 'bold',
                               family: "'Helvetica Neue', Helvetica, Arial, sans-serif"
                           },
                            min: 4.9,
                            max: 6.9,
                            stepSize: 0.5,
                            includeBounds: true,
                            autoSkip: false,
                            maxTicksLimit: 20,
                            callback: function(value) {
                                return value.toFixed(1) + "'";
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        },
                        min: 4.9,
                        max: 6.9,
                        grace: 0,
                        beginAtZero: false
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'point'
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
        
        console.log('✅ Chart created successfully!');
        
        // Add tooltip functionality
        chartCanvas.addEventListener('mousemove', function(event) {
            const elements = window.wealthChart.getElementsAtEventForMode(event, 'point', { intersect: true }, true);
            
            if (elements.length > 0) {
                const element = elements[0];
                const datasetIndex = element.datasetIndex;
                const dataIndex = element.index;
                const pointData = window.wealthChart.data.datasets[datasetIndex].data[dataIndex];
                
                if (pointData && pointData.name) {
                    // Show tooltip
                    chartCanvas.style.cursor = 'pointer';
                    
                    // Create tooltip if it doesn't exist
                    let tooltip = document.getElementById('chart-tooltip');
                    if (!tooltip) {
                        tooltip = document.createElement('div');
                        tooltip.id = 'chart-tooltip';
                         const isMobile = window.innerWidth <= 768;
                         tooltip.style.cssText = `
                             position: fixed;
                             background: rgba(0, 0, 0, 0.9);
                             color: white;
                             padding: ${isMobile ? '8px' : '12px'};
                             border-radius: 8px;
                             border: 2px solid #00d4ff;
                             font-size: ${isMobile ? '12px' : '14px'};
                             z-index: 10000;
                             pointer-events: none;
                             font-family: 'Segoe UI', sans-serif;
                             max-width: ${isMobile ? '250px' : '300px'};
                             box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                         `;
                        document.body.appendChild(tooltip);
                    }
                    
                     tooltip.innerHTML = `
                         <div style="font-weight: bold; color: #00d4ff; margin-bottom: 4px;">${pointData.name}</div>
                         <div>Wealth: $${formatNumber(pointData.x)}</div>
                         <div>Height: ${pointData.y.toFixed(1)} ft</div>
                         <div>Status: ${pointData.status || 'Unknown'}</div>
                         <div>Source: ${pointData.source || 'Unknown'}</div>
                     `;
                     
                     // Aggressive positioning to prevent overflow
                     const viewportWidth = window.innerWidth;
                     const viewportHeight = window.innerHeight;
                     const isMobile = window.innerWidth <= 768;
                     const tooltipWidth = isMobile ? 250 : 300;
                     const tooltipHeight = isMobile ? 120 : 150;
                     
                     let left = event.clientX + 10;
                     let top = event.clientY - 10;
                     
                     // Force tooltip to stay within viewport bounds
                     if (left + tooltipWidth > viewportWidth - 10) {
                         left = viewportWidth - tooltipWidth - 10;
                     }
                     
                     if (top + tooltipHeight > viewportHeight - 10) {
                         top = viewportHeight - tooltipHeight - 10;
                     }
                     
                     if (left < 10) {
                         left = 10;
                     }
                     
                     if (top < 10) {
                         top = 10;
                     }
                     
                     tooltip.style.left = left + 'px';
                     tooltip.style.top = top + 'px';
                     tooltip.style.display = 'block';
                }
            } else {
                chartCanvas.style.cursor = 'default';
                const tooltip = document.getElementById('chart-tooltip');
                if (tooltip) {
                    tooltip.style.display = 'none';
                }
            }
        });
        
        chartCanvas.addEventListener('mouseleave', function() {
            chartCanvas.style.cursor = 'default';
            const tooltip = document.getElementById('chart-tooltip');
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        });
        
    } catch (error) {
        console.error('❌ Error creating chart:', error);
        showError('Failed to create chart. Please check the console for details.');
    }
}

// Initialize pie chart
function initializePieChart() {
    if (!pieChartCanvas) {
        console.error('Pie chart canvas not found');
        return;
    }
    
    const ctx = pieChartCanvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2D context for pie chart');
        return;
    }
    
    // Use the same wealth density calculation
    const wealthData = calculateWealthDensity(data);
    
    // Define height ranges with colors based on density
    const heightRanges = [
        { name: '4\'9" - 5\'3"', min: 4.9, max: 5.3, color: 'rgba(255, 165, 0, 0.8)' },      // Orange
        { name: '5\'4" - 5\'6"', min: 5.3, max: 5.6, color: 'rgba(0, 212, 255, 0.8)' },      // Light Blue
        { name: '5\'7" - 5\'9"', min: 5.6, max: 5.9, color: 'rgba(200, 200, 200, 0.8)' },    // Light Gray
        { name: '5\'10" - 6\'0"', min: 5.9, max: 6.0, color: 'rgba(100, 100, 100, 0.8)' },   // Dark Gray
        { name: '6\'1" - 6\'3"', min: 6.0, max: 6.3, color: 'rgba(255, 100, 0, 0.8)' },      // Dark Orange
        { name: '6\'4" - 6\'6"', min: 6.3, max: 6.6, color: 'rgba(255, 20, 147, 0.8)' },     // Pink
        { name: '6\'7" - 6\'9"', min: 6.6, max: 6.9, color: 'rgba(50, 205, 50, 0.8)' }       // Green
    ];
    
    const pieData = heightRanges.map(range => {
        const peopleInRange = data.filter(person => 
            person.height >= range.min && person.height < range.max
        );
        const totalWealth = peopleInRange.reduce((sum, person) => sum + person.wealth, 0);
        return {
            label: range.name,
            count: peopleInRange.length,
            totalWealth: totalWealth,
            color: range.color
        };
    }).filter(item => item.count > 0);
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: pieData.map(item => item.label),
            datasets: [{
                data: pieData.map(item => item.totalWealth),
                backgroundColor: pieData.map(item => item.color),
                borderColor: pieData.map(item => item.color.replace('0.8', '1')),
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Total Wealth by Height Range',
                    color: '#ffffff',
                   font: {
                       size: 20,
                       weight: 'bold',
                       family: "'Helvetica Neue', Helvetica, Arial, sans-serif"
                   },
                    padding: 20
                },
                legend: {
                    position: 'right',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Helper function to format numbers
function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    } else {
        return num.toFixed(0);
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
}

// Global wealth data for success calculator
let globalWealthData = null;

// Initialize success calculator functionality
function initializeSuccessCalculator() {
    // Floating button click handler
    const floatingBtn = document.getElementById('floatingCalculatorBtn');
    const successSection = document.querySelector('.success-calculator-section');
    
    // Ensure button is visible and properly positioned
    if (floatingBtn) {
        console.log('✅ Floating button found and initialized');
        
        // Force button positioning
        floatingBtn.style.position = 'fixed';
        floatingBtn.style.bottom = '20px';
        floatingBtn.style.right = '20px';
        floatingBtn.style.zIndex = '9999';
        floatingBtn.style.display = 'flex';
        floatingBtn.style.visibility = 'visible';
        floatingBtn.style.opacity = '1';
        
        if (successSection) {
            floatingBtn.addEventListener('click', () => {
                successSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    } else {
        console.error('❌ Floating button not found!');
    }
    
    // Calculate success button handler
    const calculateBtn = document.getElementById('calculateSuccess');
    const heightSelect = document.getElementById('heightSelect');
    const successResult = document.getElementById('successResult');
    
     if (calculateBtn && heightSelect && successResult) {
         calculateBtn.addEventListener('click', () => {
             console.log('Calculate button clicked');
             calculateSuccessProbability();
         });
        
        // Also calculate when dropdown selection changes
        heightSelect.addEventListener('change', () => {
            if (heightSelect.value) {
                calculateSuccessProbability();
            }
        });
    }
}

// Calculate success probability based on height
function calculateSuccessProbability() {
    console.log('calculateSuccessProbability called');
    const heightSelect = document.getElementById('heightSelect');
    const successResult = document.getElementById('successResult');
    
    console.log('Elements found:', { heightSelect: !!heightSelect, successResult: !!successResult, globalWealthData: !!globalWealthData });
    
    if (!heightSelect || !successResult || !globalWealthData) {
        console.error('Missing elements or data for success calculation');
        return;
    }
    
    const heightInFeet = parseFloat(heightSelect.value);
    
    if (!heightInFeet || heightInFeet <= 0) {
        successResult.innerHTML = `
            <div style="color: #ff6b6b;">
                <strong>⚠️ Please select your height!</strong><br>
                Choose your height from the dropdown above.
            </div>
        `;
        successResult.classList.add('show');
        return;
    }
    
     // Find the closest height bin in the data
     const availableHeights = Object.keys(globalWealthData.densityMap).map(h => parseFloat(h));
     const closestHeight = availableHeights.reduce((closest, current) => 
         Math.abs(current - heightInFeet) < Math.abs(closest - heightInFeet) ? current : closest
     );
     
     // Get wealth density for the closest height
     const wealthDensity = globalWealthData.densityMap[closestHeight] || 0;
     
     // Get top 3 names for the closest height
     const topNames = globalWealthData.topNamesByHeight[closestHeight] || [];
    
    // Calculate success probability (0-100%)
    const successProbability = Math.round(wealthDensity * 100);
    
    // Get height ranking
    const allHeights = Object.entries(globalWealthData.densityMap)
        .sort((a, b) => b[1] - a[1]);
    const heightRank = allHeights.findIndex(([height]) => parseFloat(height) === heightBin) + 1;
    const totalHeights = allHeights.length;
    
    // Generate result message
    let resultHTML = '';
    
    if (successProbability >= 80) {
        resultHTML = `
            <div style="color: #ffffff;">
                <div style="font-size: 2.5rem; margin-bottom: 1.5rem; color: #4ade80;">🎯</div>
                <div style="font-size: 1.8rem; font-weight: 700; color: #4ade80; margin-bottom: 1.5rem; line-height: 1.2;">EXCELLENT SUCCESS POTENTIAL!</div>
                <div style="background: rgba(74, 222, 128, 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #4ade80;">
                    <div style="font-size: 1.3rem; font-weight: 600; color: #ffffff; margin-bottom: 0.5rem;">Success Probability: <span style="color: #4ade80;">${successProbability}%</span></div>
                    ${topNames.length > 0 ? `<div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Top at this height: ${topNames.join(', ')}</div>` : ''}
                </div>
            </div>
        `;
    } else if (successProbability >= 60) {
        resultHTML = `
            <div style="color: #ffffff;">
                <div style="font-size: 2.5rem; margin-bottom: 1.5rem; color: #fbbf24;">⭐</div>
                <div style="font-size: 1.8rem; font-weight: 700; color: #fbbf24; margin-bottom: 1.5rem; line-height: 1.2;">STRONG SUCCESS POTENTIAL!</div>
                <div style="background: rgba(251, 191, 36, 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #fbbf24;">
                    <div style="font-size: 1.3rem; font-weight: 600; color: #ffffff; margin-bottom: 0.5rem;">Success Probability: <span style="color: #fbbf24;">${successProbability}%</span></div>
                    ${topNames.length > 0 ? `<div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Top at this height: ${topNames.join(', ')}</div>` : ''}
                </div>
            </div>
        `;
    } else if (successProbability >= 40) {
        resultHTML = `
            <div style="color: #ffffff;">
                <div style="font-size: 2.5rem; margin-bottom: 1.5rem; color: #f59e0b;">📈</div>
                <div style="font-size: 1.8rem; font-weight: 700; color: #f59e0b; margin-bottom: 1.5rem; line-height: 1.2;">MODERATE SUCCESS POTENTIAL</div>
                <div style="background: rgba(245, 158, 11, 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #f59e0b;">
                    <div style="font-size: 1.3rem; font-weight: 600; color: #ffffff; margin-bottom: 0.5rem;">Success Probability: <span style="color: #f59e0b;">${successProbability}%</span></div>
                    ${topNames.length > 0 ? `<div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Top at this height: ${topNames.join(', ')}</div>` : ''}
                </div>
            </div>
        `;
    } else if (successProbability >= 20) {
        resultHTML = `
            <div style="color: #ffffff;">
                <div style="font-size: 2.5rem; margin-bottom: 1.5rem; color: #f97316;">💪</div>
                <div style="font-size: 1.8rem; font-weight: 700; color: #f97316; margin-bottom: 1.5rem; line-height: 1.2;">CHALLENGING BUT POSSIBLE</div>
                <div style="background: rgba(249, 115, 22, 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #f97316;">
                    <div style="font-size: 1.3rem; font-weight: 600; color: #ffffff; margin-bottom: 0.5rem;">Success Probability: <span style="color: #f97316;">${successProbability}%</span></div>
                    ${topNames.length > 0 ? `<div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Top at this height: ${topNames.join(', ')}</div>` : ''}
                </div>
            </div>
        `;
    } else {
        resultHTML = `
            <div style="color: #ffffff;">
                <div style="font-size: 2.5rem; margin-bottom: 1.5rem; color: #8b5cf6;">🚀</div>
                <div style="font-size: 1.8rem; font-weight: 700; color: #8b5cf6; margin-bottom: 1.5rem; line-height: 1.2;">UNDERDOG SUCCESS STORY WAITING TO HAPPEN!</div>
                <div style="background: rgba(139, 92, 246, 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #8b5cf6;">
                    <div style="font-size: 1.3rem; font-weight: 600; color: #ffffff; margin-bottom: 0.5rem;">Success Probability: <span style="color: #8b5cf6;">${successProbability}%</span></div>
                    ${topNames.length > 0 ? `<div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Top at this height: ${topNames.join(', ')}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    // Add "How it's calculated" button
    resultHTML += `
        <div style="text-align: center; margin-top: 1.5rem;">
            <button onclick="window.open('https://matiks.com', '_blank')" style="
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                color: rgba(255, 255, 255, 0.9);
                padding: 0.75rem 1.5rem;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 0.9rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
            " onmouseover="this.style.background='rgba(255, 255, 255, 0.2)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'">
                How it's calculated
            </button>
        </div>
    `;
    
    successResult.innerHTML = resultHTML;
    successResult.classList.add('show');
    
    // Scroll to result
    successResult.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
    });
}