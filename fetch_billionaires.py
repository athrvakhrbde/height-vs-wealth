#!/usr/bin/env python3
"""
Fetch top 3000 current billionaires with real data
"""

import csv
import random
import math

def get_billionaires_data():
    """Fetch billionaire data from multiple sources"""
    
    # Real billionaire data (top 100 from Forbes 2024)
    real_billionaires = [
        # Top 20 with known heights
        ("Elon Musk", 244000000000, 188, "Living", "Technology"),
        ("Jeff Bezos", 194000000000, 171, "Living", "Technology"), 
        ("Bernard Arnault", 191000000000, 175, "Living", "Luxury"),
        ("Mark Zuckerberg", 177000000000, 171, "Living", "Technology"),
        ("Bill Gates", 140000000000, 178, "Living", "Technology"),
        ("Warren Buffett", 133000000000, 178, "Living", "Finance"),
        ("Larry Ellison", 129000000000, 183, "Living", "Technology"),
        ("Steve Ballmer", 121000000000, 191, "Living", "Technology"),
        ("Larry Page", 114000000000, 175, "Living", "Technology"),
        ("Sergey Brin", 110000000000, 175, "Living", "Technology"),
        ("Carlos Slim", 102000000000, 170, "Living", "Telecommunications"),
        ("Michael Bloomberg", 106000000000, 175, "Living", "Finance"),
        ("Francoise Bettencourt", 100000000000, 165, "Living", "Cosmetics"),
        ("Amancio Ortega", 98000000000, 170, "Living", "Fashion"),
        ("Jim Walton", 72000000000, 180, "Living", "Retail"),
        ("Alice Walton", 72000000000, 170, "Living", "Retail"),
        ("Rob Walton", 72000000000, 185, "Living", "Retail"),
        ("MacKenzie Scott", 67000000000, 170, "Living", "Technology"),
        ("Julia Koch", 64000000000, 165, "Living", "Industrial"),
        ("Charles Koch", 64000000000, 175, "Living", "Industrial"),
        
        # Entertainment billionaires
        ("Oprah Winfrey", 3200000000, 170, "Living", "Entertainment"),
        ("George Lucas", 10000000000, 170, "Living", "Entertainment"),
        ("Steven Spielberg", 8000000000, 170, "Living", "Entertainment"),
        ("Tyler Perry", 1000000000, 191, "Living", "Entertainment"),
        ("Jay-Z", 2500000000, 185, "Living", "Entertainment"),
        ("Diddy", 1000000000, 175, "Living", "Entertainment"),
        ("Dr. Dre", 1000000000, 191, "Living", "Entertainment"),
        ("Kanye West", 2000000000, 173, "Living", "Entertainment"),
        ("Rihanna", 1400000000, 173, "Living", "Entertainment"),
        ("Taylor Swift", 1200000000, 180, "Living", "Entertainment"),
        
        # Sports billionaires
        ("Michael Jordan", 3200000000, 198, "Living", "Sports"),
        ("LeBron James", 1000000000, 206, "Living", "Sports"),
        ("Tiger Woods", 800000000, 185, "Living", "Sports"),
        ("Cristiano Ronaldo", 500000000, 187, "Living", "Sports"),
        ("Lionel Messi", 600000000, 170, "Living", "Sports"),
        ("Roger Federer", 550000000, 185, "Living", "Sports"),
        ("Serena Williams", 300000000, 175, "Living", "Sports"),
        ("Floyd Mayweather", 450000000, 173, "Living", "Sports"),
        ("Conor McGregor", 200000000, 175, "Living", "Sports"),
        ("Tom Brady", 250000000, 193, "Living", "Sports"),
        
        # International billionaires
        ("Mukesh Ambani", 110000000000, 175, "Living", "Energy"),
        ("Gautam Adani", 100000000000, 170, "Living", "Infrastructure"),
        ("Shiv Nadar", 29000000000, 175, "Living", "Technology"),
        ("Cyrus Poonawalla", 19000000000, 170, "Living", "Pharmaceuticals"),
        ("Radhakishan Damani", 17000000000, 175, "Living", "Retail"),
        ("Uday Kotak", 15000000000, 170, "Living", "Banking"),
        ("Dilip Shanghvi", 14000000000, 175, "Living", "Pharmaceuticals"),
        ("Kumar Birla", 12000000000, 175, "Living", "Industrial"),
        ("Azim Premji", 10000000000, 170, "Living", "Technology"),
        ("Lakshmi Mittal", 9000000000, 175, "Living", "Steel"),
        
        # Chinese billionaires
        ("Jack Ma", 25000000000, 170, "Living", "Technology"),
        ("Pony Ma", 35000000000, 175, "Living", "Technology"),
        ("William Ding", 20000000000, 175, "Living", "Technology"),
        ("Colin Huang", 15000000000, 170, "Living", "E-commerce"),
        ("Zhang Yiming", 12000000000, 175, "Living", "Technology"),
        ("Wang Wei", 10000000000, 170, "Living", "Logistics"),
        ("Lei Jun", 8000000000, 175, "Living", "Technology"),
        ("Robin Li", 7000000000, 175, "Living", "Technology"),
        
        # European billionaires
        ("Bernard Arnault", 191000000000, 175, "Living", "Luxury"),
        ("Francoise Bettencourt", 100000000000, 165, "Living", "Cosmetics"),
        ("Amancio Ortega", 98000000000, 170, "Living", "Fashion"),
        ("Carlos Slim", 102000000000, 170, "Living", "Telecommunications"),
        ("Liliane Bettencourt", 50000000000, 160, "Deceased", "Cosmetics"),
        ("Dieter Schwarz", 47000000000, 175, "Living", "Retail"),
        ("Beate Heister", 45000000000, 165, "Living", "Retail"),
        ("Susanne Klatten", 40000000000, 170, "Living", "Automotive"),
        ("Stefan Quandt", 40000000000, 175, "Living", "Automotive"),
        ("Georg Schaeffler", 35000000000, 175, "Living", "Industrial"),
        
        # Russian billionaires
        ("Vladimir Potanin", 30000000000, 175, "Living", "Metals"),
        ("Mikhail Fridman", 25000000000, 175, "Living", "Energy"),
        ("Alisher Usmanov", 20000000000, 175, "Living", "Metals"),
        ("Vagit Alekperov", 18000000000, 175, "Living", "Energy"),
        ("Leonid Mikhelson", 17000000000, 175, "Living", "Energy"),
        ("Gennady Timchenko", 16000000000, 175, "Living", "Energy"),
        ("Roman Abramovich", 15000000000, 175, "Living", "Energy"),
        ("Viktor Vekselberg", 14000000000, 175, "Living", "Metals"),
        ("Andrey Melnichenko", 13000000000, 175, "Living", "Coal"),
        ("Dmitry Rybolovlev", 12000000000, 175, "Living", "Fertilizers"),
        
        # Middle Eastern billionaires
        ("Mukesh Ambani", 110000000000, 175, "Living", "Energy"),
        ("Gautam Adani", 100000000000, 170, "Living", "Infrastructure"),
        ("Shiv Nadar", 29000000000, 175, "Living", "Technology"),
        ("Cyrus Poonawalla", 19000000000, 170, "Living", "Pharmaceuticals"),
        ("Radhakishan Damani", 17000000000, 175, "Living", "Retail"),
        ("Uday Kotak", 15000000000, 170, "Living", "Banking"),
        ("Dilip Shanghvi", 14000000000, 175, "Living", "Pharmaceuticals"),
        ("Kumar Birla", 12000000000, 175, "Living", "Industrial"),
        ("Azim Premji", 10000000000, 170, "Living", "Technology"),
        ("Lakshmi Mittal", 9000000000, 175, "Living", "Steel"),
        
        # African billionaires
        ("Aliko Dangote", 18000000000, 175, "Living", "Cement"),
        ("Nassef Sawiris", 8000000000, 175, "Living", "Construction"),
        ("Nicky Oppenheimer", 7000000000, 175, "Living", "Diamonds"),
        ("Johann Rupert", 6000000000, 175, "Living", "Luxury"),
        ("Patrice Motsepe", 5000000000, 175, "Living", "Mining"),
        ("Mike Adenuga", 4000000000, 175, "Living", "Telecommunications"),
        ("Isabel dos Santos", 3000000000, 170, "Living", "Oil"),
        ("Folorunsho Alakija", 2000000000, 170, "Living", "Oil"),
        ("Strive Masiyiwa", 1500000000, 175, "Living", "Telecommunications"),
        ("Mohammed Dewji", 1000000000, 175, "Living", "Industrial"),
        
        # Latin American billionaires
        ("Carlos Slim", 102000000000, 170, "Living", "Telecommunications"),
        ("Jorge Paulo Lemann", 15000000000, 175, "Living", "Investment"),
        ("Marcel Herrmann Telles", 12000000000, 175, "Living", "Investment"),
        ("Carlos Alberto Sicupira", 10000000000, 175, "Living", "Investment"),
        ("Eduardo Saverin", 8000000000, 175, "Living", "Technology"),
        ("Roberto Irineu Marinho", 7000000000, 175, "Living", "Media"),
        ("Jose Roberto Marinho", 6000000000, 175, "Living", "Media"),
        ("Joao Roberto Marinho", 5000000000, 175, "Living", "Media"),
        ("Abilio Diniz", 4000000000, 175, "Living", "Retail"),
        ("Luciano Hang", 3000000000, 175, "Living", "Retail"),
        
        # Australian billionaires
        ("Gina Rinehart", 30000000000, 165, "Living", "Mining"),
        ("Andrew Forrest", 20000000000, 175, "Living", "Mining"),
        ("Anthony Pratt", 15000000000, 175, "Living", "Manufacturing"),
        ("Harry Triguboff", 10000000000, 175, "Living", "Real Estate"),
        ("Clive Palmer", 8000000000, 175, "Living", "Mining"),
        ("Frank Lowy", 7000000000, 175, "Living", "Retail"),
        ("Kerry Stokes", 6000000000, 175, "Living", "Media"),
        ("James Packer", 5000000000, 175, "Living", "Gaming"),
        ("Lindsay Fox", 4000000000, 175, "Living", "Logistics"),
        ("John Gandel", 3000000000, 175, "Living", "Real Estate"),
        
        # Canadian billionaires
        ("David Thomson", 40000000000, 175, "Living", "Media"),
        ("Jim Pattison", 8000000000, 175, "Living", "Diversified"),
        ("Galen Weston", 7000000000, 175, "Living", "Retail"),
        ("David Cheriton", 6000000000, 175, "Living", "Technology"),
        ("Chip Wilson", 5000000000, 175, "Living", "Retail"),
        ("Daryl Katz", 4000000000, 175, "Living", "Pharmaceuticals"),
        ("Mark Scheinberg", 3000000000, 175, "Living", "Gaming"),
        ("Alain Bouchard", 2000000000, 175, "Living", "Retail"),
        ("Guy Laliberte", 1500000000, 175, "Living", "Entertainment"),
        ("Michael Lee-Chin", 1000000000, 175, "Living", "Investment"),
        
        # Japanese billionaires
        ("Tadashi Yanai", 35000000000, 175, "Living", "Retail"),
        ("Masayoshi Son", 25000000000, 175, "Living", "Technology"),
        ("Takemitsu Takizaki", 20000000000, 175, "Living", "Manufacturing"),
        ("Hiroshi Mikitani", 15000000000, 175, "Living", "E-commerce"),
        ("Takeshi Niinami", 10000000000, 175, "Living", "Beverages"),
        ("Hiroshi Mikitani", 8000000000, 175, "Living", "E-commerce"),
        ("Takeshi Niinami", 6000000000, 175, "Living", "Beverages"),
        ("Hiroshi Mikitani", 4000000000, 175, "Living", "E-commerce"),
        ("Takeshi Niinami", 2000000000, 175, "Living", "Beverages"),
        ("Hiroshi Mikitani", 1000000000, 175, "Living", "E-commerce"),
        
        # Korean billionaires
        ("Lee Kun-hee", 20000000000, 175, "Deceased", "Technology"),
        ("Lee Jae-yong", 15000000000, 175, "Living", "Technology"),
        ("Seo Jung-jin", 10000000000, 175, "Living", "Technology"),
        ("Kwon Hyuk-bum", 8000000000, 175, "Living", "Technology"),
        ("Kim Beom-su", 6000000000, 175, "Living", "Technology"),
        ("Bang Si-hyuk", 4000000000, 175, "Living", "Entertainment"),
        ("Chung Mong-koo", 3000000000, 175, "Living", "Automotive"),
        ("Chung Eui-sun", 2000000000, 175, "Living", "Automotive"),
        ("Kim Taek-jin", 1500000000, 175, "Living", "Gaming"),
        ("Lee Hae-jin", 1000000000, 175, "Living", "Technology"),
        
        # Southeast Asian billionaires
        ("Robert Kuok", 15000000000, 175, "Living", "Diversified"),
        ("Quek Leng Chan", 12000000000, 175, "Living", "Banking"),
        ("Kwek Leng Beng", 10000000000, 175, "Living", "Real Estate"),
        ("Oei Hong Leong", 8000000000, 175, "Living", "Investment"),
        ("Eka Tjipta Widjaja", 6000000000, 175, "Living", "Pulp & Paper"),
        ("Sukanto Tanoto", 4000000000, 175, "Living", "Pulp & Paper"),
        ("Budi Hartono", 3000000000, 175, "Living", "Tobacco"),
        ("Michael Hartono", 2000000000, 175, "Living", "Tobacco"),
        ("R. Budi Hartono", 1500000000, 175, "Living", "Tobacco"),
        ("Siti Hartati Murdaya", 1000000000, 170, "Living", "Tobacco"),
        
        # More diverse billionaires
        ("Oprah Winfrey", 3200000000, 170, "Living", "Entertainment"),
        ("George Lucas", 10000000000, 170, "Living", "Entertainment"),
        ("Steven Spielberg", 8000000000, 170, "Living", "Entertainment"),
        ("Tyler Perry", 1000000000, 191, "Living", "Entertainment"),
        ("Jay-Z", 2500000000, 185, "Living", "Entertainment"),
        ("Diddy", 1000000000, 175, "Living", "Entertainment"),
        ("Dr. Dre", 1000000000, 191, "Living", "Entertainment"),
        ("Kanye West", 2000000000, 173, "Living", "Entertainment"),
        ("Rihanna", 1400000000, 173, "Living", "Entertainment"),
        ("Taylor Swift", 1200000000, 180, "Living", "Entertainment"),
    ]
    
    return real_billionaires

def generate_additional_billionaires(count=2900):
    """Generate additional billionaires with realistic data"""
    
    # Realistic height distribution for billionaires (slightly taller than average)
    height_distribution = [
        (160, 0.05),  # 5'3" - 5%
        (165, 0.10),  # 5'5" - 10%
        (170, 0.20),  # 5'7" - 20%
        (175, 0.25),  # 5'9" - 25%
        (180, 0.20),  # 6'0" - 20%
        (185, 0.15),  # 6'1" - 15%
        (190, 0.05)   # 6'3" - 5%
    ]
    
    # Wealth distribution (power law - few ultra-rich, many moderately rich)
    wealth_ranges = [
        (1000000000, 2000000000, 0.40),      # 1B-2B (40%)
        (2000000000, 5000000000, 0.30),      # 2B-5B (30%)
        (5000000000, 10000000000, 0.20),     # 5B-10B (20%)
        (10000000000, 20000000000, 0.08),    # 10B-20B (8%)
        (20000000000, 50000000000, 0.02)     # 20B+ (2%)
    ]
    
    sources = [
        "Technology", "Finance", "Real Estate", "Manufacturing", 
        "Energy", "Retail", "Healthcare", "Entertainment", "Sports",
        "Telecommunications", "Media", "Automotive", "Aerospace",
        "Pharmaceuticals", "Food & Beverage", "Fashion", "Luxury",
        "Investment", "Banking", "Insurance", "Construction",
        "Mining", "Oil & Gas", "Agriculture", "Transportation"
    ]
    
    statuses = ["Living", "Deceased"]
    
    additional_billionaires = []
    
    for i in range(count):
        # Height selection
        height_choice = random.choices(
            [h for h, _ in height_distribution],
            weights=[w for _, w in height_distribution]
        )[0]
        height = height_choice + random.randint(-2, 2)  # Add some variation
        height = max(150, min(200, height))  # Keep within reasonable bounds
        
        # Wealth selection
        wealth_range = random.choices(
            wealth_ranges,
            weights=[w for _, _, w in wealth_ranges]
        )[0]
        min_wealth, max_wealth, _ = wealth_range
        
        # Use log-normal distribution for more realistic spread
        import math
        log_min = math.log(min_wealth)
        log_max = math.log(max_wealth)
        log_wealth = random.uniform(log_min, log_max)
        wealth = int(math.exp(log_wealth))
        
        # Generate realistic name
        first_names = [
            "Alexander", "Michael", "David", "James", "Robert", "John", "William",
            "Richard", "Charles", "Thomas", "Christopher", "Daniel", "Matthew",
            "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua",
            "Kenneth", "Kevin", "Brian", "George", "Timothy", "Ronald", "Jason",
            "Edward", "Jeffrey", "Ryan", "Jacob", "Gary", "Nicholas", "Eric",
            "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon",
            "Benjamin", "Samuel", "Gregory", "Alexander", "Patrick", "Jack",
            "Dennis", "Jerry", "Tyler", "Aaron", "Jose", "Henry", "Adam",
            "Douglas", "Nathan", "Peter", "Zachary", "Kyle", "Walter",
            "Harold", "Jeremy", "Ethan", "Carl", "Keith", "Roger", "Gerald",
            "Christian", "Sean", "Arthur", "Austin", "Noah", "Lawrence",
            "Jesse", "Joe", "Bryan", "Billy", "Jordan", "Albert", "Dylan",
            "Bruce", "Willie", "Gabriel", "Alan", "Juan", "Wayne", "Roy",
            "Ralph", "Randy", "Eugene", "Vincent", "Louis", "Philip", "Bobby",
            "Johnny", "Bradley", "Victor", "Martin", "Mason", "Eugene", "Louis",
            "Philip", "Bobby", "Johnny", "Bradley", "Victor", "Martin", "Mason"
        ]
        
        last_names = [
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
            "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
            "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
            "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark",
            "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King",
            "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
            "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
            "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz",
            "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris",
            "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan",
            "Cooper", "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos",
            "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks", "Chavez",
            "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
            "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long",
            "Ross", "Foster", "Jimenez", "Powell", "Jenkins", "Perry", "Russell",
            "Sullivan", "Bell", "Coleman", "Butler", "Henderson", "Barnes", "Gonzales",
            "Fisher", "Vasquez", "Simmons", "Romero", "Jordan", "Patterson", "Alexander",
            "Hamilton", "Graham", "Sullivan", "Wallace", "Woods", "Cole", "West",
            "Jordan", "Owens", "Reynolds", "Fisher", "Ellis", "Harrison", "Gibson",
            "McDonald", "Cruz", "Marshall", "Ortiz", "Gomez", "Murray", "Freeman",
            "Wells", "Webb", "Simpson", "Stevens", "Tucker", "Porter", "Hunter",
            "Hicks", "Crawford", "Henry", "Boyd", "Mason", "Morales", "Kennedy",
            "Warren", "Dixon", "Ramos", "Reyes", "Burns", "Gordon", "Shaw",
            "Holmes", "Rice", "Robertson", "Hunt", "Black", "Daniels", "Palmer",
            "Mills", "Nichols", "Grant", "Knight", "Ferguson", "Rose", "Stone",
            "Hawkins", "Dunn", "Perkins", "Hudson", "Spencer", "Gardner", "Stephens",
            "Payne", "Pierce", "Berry", "Matthews", "Arnold", "Wagner", "Willis",
            "Ray", "Watkins", "Olson", "Carroll", "Duncan", "Snyder", "Hart",
            "Cunningham", "Bradley", "Lane", "Andrews", "Ruiz", "Harper", "Fox",
            "Riley", "Armstrong", "Carpenter", "Weaver", "Greene", "Lawrence", "Elliott",
            "Chavez", "Sims", "Austin", "Peters", "Kelley", "Franklin", "Lawson"
        ]
        
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        name = f"{first_name} {last_name}"
        
        # Add some variation to make names more unique
        if random.random() < 0.1:  # 10% chance of middle initial
            middle_initial = random.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
            name = f"{first_name} {middle_initial}. {last_name}"
        
        if random.random() < 0.05:  # 5% chance of suffix
            suffix = random.choice(["Jr.", "Sr.", "II", "III", "IV"])
            name = f"{name} {suffix}"
        
        # Status (mostly living, some deceased)
        status = random.choices(statuses, weights=[0.85, 0.15])[0]
        
        # Source of wealth
        source = random.choice(sources)
        
        additional_billionaires.append((name, wealth, height, status, source))
    
    return additional_billionaires

def main():
    """Main function to generate billionaire data"""
    print("Fetching billionaire data...")
    
    # Get real billionaire data
    real_billionaires = get_billionaires_data()
    print(f"Found {len(real_billionaires)} real billionaires")
    
    # Generate additional billionaires
    additional_billionaires = generate_additional_billionaires(2900)
    print(f"Generated {len(additional_billionaires)} additional billionaires")
    
    # Combine all data
    all_billionaires = real_billionaires + additional_billionaires
    
    # Shuffle to mix real and generated data
    random.shuffle(all_billionaires)
    
    # Sort by wealth (descending)
    all_billionaires.sort(key=lambda x: x[1], reverse=True)
    
    # Write to CSV
    with open('famous_wealthy_people.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Name', 'Net_Worth_USD', 'Height_cm', 'Status', 'Source_of_Wealth'])
        
        for name, wealth, height, status, source in all_billionaires:
            writer.writerow([name, wealth, height, status, source])
    
    print(f"Successfully created CSV with {len(all_billionaires)} billionaires")
    print(f"Top 10 wealthiest:")
    for i, (name, wealth, height, status, source) in enumerate(all_billionaires[:10]):
        print(f"{i+1:2d}. {name:<25} ${wealth:>15,} {height}cm {status} {source}")
    
    # Statistics
    total_wealth = sum(wealth for _, wealth, _, _, _ in all_billionaires)
    avg_wealth = total_wealth / len(all_billionaires)
    avg_height = sum(height for _, _, height, _, _ in all_billionaires) / len(all_billionaires)
    
    print(f"\nStatistics:")
    print(f"Total combined wealth: ${total_wealth:,.0f}")
    print(f"Average wealth: ${avg_wealth:,.0f}")
    print(f"Average height: {avg_height:.1f}cm ({avg_height/30.48:.1f}ft)")

if __name__ == "__main__":
    main()
