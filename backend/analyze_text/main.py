import schedule
import time
from functions.scheduler import scheduler_function

# Schedule the function to run every 4 hours
schedule.every(4).hours.do(scheduler_function)

if __name__ == '__main__':
    # Run the code instantly
    scheduler_function()

    # Run the code every 4 hours
    while True:
        schedule.run_pending()
        time.sleep(60)