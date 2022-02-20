set -x
PID=$(lsof -t -i:3000)
if [ -z "${PID}" ]; then
    echo "no node app running..."
  else
    echo "stop app running on port 3000 with PID ${PID}"
    kill -9 ${PID}
fi
set +x