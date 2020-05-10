- https://code.visualstudio.com/docs/python/python-tutorial

```
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install Flask
python3 -m pip install connexion
python3 -m pip install flask-restful

pip freeze | xargs pip uninstall -y
pip install -r ./requirements.txt
export FLASK_DEBUG=1
export FLASK_APP=server.py
python -m flask run -h 0.0.0.0 -p 5000 --no-debugger --no-reload

chmod +x web-dev.sh
./web-dev.sh
```

- https://stackoverflow.com/questions/54106071/how-to-setup-virtual-environment-for-python-in-vs-code

https://toutiao.io/posts/kpiyrn/preview
https://hackersandslackers.com/sqlalchemy-data-models/
https://leportella.com/sqlalchemy-tutorial.html
