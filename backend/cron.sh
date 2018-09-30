apt-get install -y cron &&
echo 'MAILTO=""' > /etc/cron.d/teamtasks &&
echo "30 9 * * * root cd /teamtasks/backend; python manage.py slack_unplanned 2>&1 >> /var/log/teamtasks.log" >> /etc/cron.d/teamtasks &&
echo "30 19 * * * root cd /teamtasks/backend; python manage.py slack_unvalidated 2>&1 >> /var/log/teamtasks.log" >> /etc/cron.d/teamtasks &&
chmod 0644 /etc/cron.d/teamtasks &&
touch /var/log/teamtasks.log &&
cron &&
tail -f /var/log/teamtasks.log