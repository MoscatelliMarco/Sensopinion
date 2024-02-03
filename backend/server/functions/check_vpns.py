import ipaddress

def is_vpn(ip: str) -> bool:
    """
    Check if the given IP is within any of the CIDR ranges in vpn_ip_list.txt.

    Args:
        ip (str): The IP address to check.

    Returns:
        bool: True if the IP is within a VPN CIDR range, False otherwise.
    """
    try:
        ip_obj = ipaddress.ip_address(ip)
        with open("vpn_ip_list.txt", "r") as file:
            for line in file:
                network = ipaddress.ip_network(line.strip(), strict=False)
                if ip_obj in network:
                    return True
    except FileNotFoundError:
        print("vpn_ip_list.txt file not found.")
    except ValueError as e:
        print(f"Error processing IP or CIDR: {e}")
    return False