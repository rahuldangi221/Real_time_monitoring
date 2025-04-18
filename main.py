from flask import Flask, render_template_string
import psutil
import platform
import datetime

app = Flask(__name__)

html_template = '''
<!doctype html>
<html>
<head>
    <title>Real-Time System Monitor</title>
    <meta http-equiv="refresh" content="3">
    <style>
        body { font-family: Arial; background: #f4f4f4; padding: 20px; }
        h2 { color: #333; }
        table { border-collapse: collapse; width: 100%; background: white; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #007BFF; color: white; }
    </style>
</head>
<body>
    <h2>Real-Time System Monitoring Dashboard</h2>
    <p><strong>System:</strong> {{ system_info }}</p>
    <p><strong>CPU Usage:</strong> {{ cpu }}%</p>
    <p><strong>Memory Usage:</strong> {{ memory }}%</p>
    <p><strong>Current Time:</strong> {{ time }}</p>

    <h3>Top Processes</h3>
    <table>
        <tr><th>PID</th><th>Name</th><th>CPU %</th><th>Memory %</th></tr>
        {% for proc in processes %}
        <tr>
            <td>{{ proc.pid }}</td>
            <td>{{ proc.name }}</td>
            <td>{{ proc.cpu }}</td>
            <td>{{ proc.memory }}</td>
        </tr>
        {% endfor %}
    </table>
</body>
</html>
'''

@app.route('/')
def index():
    system_info = f"{platform.system()} {platform.release()} - {platform.processor()}"
    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory().percent
    time_now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    processes = []
    for p in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
        try:
            processes.append({
                'pid': p.info['pid'],
                'name': p.info['name'],
                'cpu': round(p.info['cpu_percent'], 2),
                'memory': round(p.info['memory_percent'], 2)
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    processes = sorted(processes, key=lambda x: x['cpu'], reverse=True)[:10]

    return render_template_string(html_template,
                                  system_info=system_info,
                                  cpu=cpu,
                                  memory=memory,
                                  time=time_now,
                                  processes=processes)

if __name__ == '__main__':
    app.run(debug=True)
