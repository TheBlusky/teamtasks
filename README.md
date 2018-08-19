## Teamtasks

`Teamtasks` is an asynchronous and online agile daily stand up tool. It is meant for small team ( < 10 persons ) and
offer a way for this team to give daily information to each other about what teammate are going to do, and what have
been done.

### What `Teamtasks` is not:

* It is not a personal todo-list application: `Teamtasks` is only meant for very short term / ongoing tasks.
* It is not a Kaban dashboard: `Teamstasks` does not allow a task's owner to be switched depending the need of users.
* It is not a time tracking application: In a perfect world `Teamtasks` is only used twice a day: first time, in the
morning, to prepare today's tasks, second time, at the end of the day, to confirm what's been done and what's not.

### What `Teamtasks` is:

Many IT project frameworks (such as `Agile`, `Scrum`, `Extreme Programming`, ...) suggests to perform a `daily meeting`
(also known as `daily stand-up`, `daily scrum`, `huddle`, `roll-call`) where every member of the team answers is
supposed to tell the rest of the team:

- What they have done since last meeting,
- What they will do until last meeting,
- What's getting in their way.

This meeting is supposed to be short (~15min.) and is sometime the first thing to do in a day.

This is an excellent practice, however, it is a very "synchronous" task:

- People have to wait that everybody is here before starting,
- If there's some discussions, sometime half the team is not listening,
- It is very painful to track (no one likes writing reports or minutes),
- It's not remote-friendly,
- Sometimes, you can forget someone, and he might get away with it ;-)

`Teamtasks` is a web application giving users a way to `plan` their workdays.

They can :
- Manage their workday (only one at a time) :
   - Create a workday (today, or tomorrow)
   - Plan the workday (ie.: answer the question `What will I do today ?`)
   - Finish the workday (ie.: answer the question `What did I do today ?`)
- See their coworkers workdays

### Roadmap

- [x] LDAP connector
- [ ] Time indicators settings
- [ ] Almighty admin's power (remove user, remove workdays)
- [ ] Removing misclicked tasks
- [ ] Slack notifications
- [X] Gamification

### Run `Teamtasks`

```
git clone https://github.com/TheBlusky/teamtasks.git
# Build dockers images
docker-compose -p teamtasks  -f docker/docker-compose.yml build --pull
# Start the environment
docker-compose -p teamtasks  -f docker/docker-compose.yml up -d frontend
# Initialise / update database
docker-compose -p teamtasks  -f docker/docker-compose.yml run --rm backend python manage.py migrate
```

You can run exactly the same commands in order to update/upgrade the project (using `git pull` instead of `git clone`)
