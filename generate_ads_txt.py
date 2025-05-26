import os

# Function to load environment variables from a .env file
def load_env(env_file='.env'):
    env_vars = {}
    if os.path.exists(env_file):
        with open(env_file) as file:
            for line in file:
                if line.startswith('#') or not line.strip():
                    continue
                key, value = line.strip().split('=', 1)
                env_vars[key] = value
    else:
        raise FileNotFoundError(f"{env_file} not found!")
    
    return env_vars

# Function to trim spaces and remove trailing commas
def format_ads_content(system, publisher_id, account_type, auth_id):
    ads_content = f"{system}, {publisher_id}, {account_type}, {auth_id}"
    return ads_content.rstrip(',')

# Function to create the ads.txt file
def generate_ads_txt():
    save_dir='./public'
    env_file='.env'
    # Load environment variables from .env
    env_vars = load_env(env_file)
    
    # Extract necessary variables, using defaults if not found
    ads_system = env_vars.get('ADS_SYSTEM', 'default-system')
    ads_publisher_id = env_vars.get('ADS_PUBLISHER_ID', 'default-publisher-id')
    ads_account_type = env_vars.get('ADS_ACCOUNT_TYPE', 'DIRECT')
    ads_auth_id = env_vars.get('ADS_AUTH_ID', 'default-auth-id')
    
    # Format the content and trim any unnecessary characters
    ads_content = format_ads_content(ads_system, ads_publisher_id, ads_account_type, ads_auth_id)
    
    # Ensure save directory exists
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
    
    # Path to save the ads.txt file
    ads_file = os.path.join(save_dir, 'ads.txt')
    
    # Write content to ads.txt file
    with open(ads_file, 'w') as file:
        file.write(ads_content)
    
    print(f"ads.txt file created at: {ads_file}")

# Run the script
if __name__ == '__main__':
    # Generate the ads.txt file
    generate_ads_txt()
