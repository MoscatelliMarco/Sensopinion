from functions.scheduler import scheduler_function
import time

if __name__ == '__main__':
    # Run the code every 4 hours
    while True:
        scheduler_function()
        time.sleep(60 * 60 * 4) # Sleep 4 hours