from flask import Flask
app = Flask(__name__)

import ptvsd
ptvsd.enable_attach(address=('0.0.0.0', 3000))
print('ptvsd is started')


@app.route('/')
def hello_world():
    print('hey111223')
    return 'Hey, we have Flask in a Docker container!'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')
