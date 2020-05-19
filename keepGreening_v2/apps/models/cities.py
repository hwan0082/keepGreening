from exts.orm import db


class City(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    post_code = db.Column(db.String(4))
    city_name = db.Column(db.String(120))
    ph_from = db.Column(db.Float)
    ph_to = db.Column(db.Float)

    def __repr__(self):
        return {'city_name': str(self.city_name),
                'post_code': str(self.post_code),
                'ph_from': self.ph_from,
                'ph_to': self.ph_to}
