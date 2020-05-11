FROM python:3.7-buster
COPY requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt
WORKDIR /opt/app
ENV PATH=$PATH:/root/.local/bin
COPY . .
RUN chmod +x /opt/app/run.sh
CMD /opt/app/run.sh