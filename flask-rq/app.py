from string import ascii_lowercase
from random import choice
from time import sleep
from flask import Flask
from redis import Redis
from rq.job import Job
from rq import Queue
import json


app = Flask(__name__)

r = Redis()
q = Queue(connection=r)


@app.route('/')
def index():
    return 'Running...'

@app.route('/new_task')
def new_task():
    print('New task inquiry')
    job = q.enqueue(long_task, n=30)
    return f'<p>Job created using RQ + Redis. Check worker terminal. Issued job ID:</p><br><p>{job.id}</p>'


@app.route('/inspect/<job_id>')
def inspect(job_id):
    job = Job.fetch(job_id, connection=r)
    print(job)
    if job.is_finished:
        ret = job.return_value
    elif job.is_queued:
        ret = {'status':'in-queue'}
    elif job.is_started:
        ret = {'status':'waiting'}
    elif job.is_failed:
        ret = {'status': 'failed'}
    return json.dumps(ret)


def long_task(n:int):
    '''returns random 4 char string after n seconds'''
    sleep(n)
    random_str = ''.join([choice(ascii_lowercase) for _ in range(5)])
    return f'Result: {random_str}'


if __name__ == '__main__':
    app.run(debug=True)
