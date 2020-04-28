from flask import Flask
from apps.views import init_view
from config import developConfig
from exts.orm import db


def create_app():
    app = Flask(__name__, template_folder='../templates')
    app.config['SECRET_KEY'] = 'dksal123kjslakj'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://admin:keepGreening.E17@keepgreening-database.cr38telodb4g.ap-southeast-2.rds.amazonaws.com/keepGreening'

    app.config['MYSQL_USER'] = 'admin'
    app.config['MYSQL_PASSWORD'] = 'keepGreening.E17'
    app.config['MYSQL_HOST'] = 'keepgreening-database.cr38telodb4g.ap-southeast-2.rds.amazonaws.com'
    app.config['MYSQL_DB'] = 'keepGreening'
    app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

    db.init_app(app)
    init_view(app)
    return app
