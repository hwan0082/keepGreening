from apps.views.bps import main_bp
from apps.views.bps import login_manager


def init_view(app):
    login_manager.init_app(app)
    app.register_blueprint(main_bp)
