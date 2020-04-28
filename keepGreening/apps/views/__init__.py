from apps.views.bps import main_bp


def init_view(app):
    app.register_blueprint(main_bp)
