# Schedule in async way
from apscheduler.schedulers.background import BackgroundScheduler
import asyncio

from functions.scheduler import scheduler_function

if __name__ == 'main':
    scheduler_function()
    # scheduler = BackgroundScheduler()
    # scheduler.add_job(scheduler_function, 'interval', hours=1)
    # scheduler.start()
    # asyncio.get_event_loop().run_forever()