# Schedule in async way
from apscheduler.schedulers.background import BackgroundScheduler
from functions.scheduler import scheduler_function
import asyncio

if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    scheduler.add_job(scheduler_function, 'interval', hours=1)
    scheduler.start()
    asyncio.get_event_loop().run_forever()