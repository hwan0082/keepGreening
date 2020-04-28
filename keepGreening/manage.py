from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from apps import create_app
from exts.orm import db
from flask_mysqldb import MySQL

app = create_app()
manager = Manager(app)
mysql = MySQL(app)

migrate = Migrate(app, db)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
