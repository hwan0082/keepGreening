from exts.orm import db


class Plant(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    plant_name = db.Column(db.String(120), nullable=False)
    scientific_name = db.Column(db.String(120))
    max_height = db.Column(db.Float)
    min_height = db.Column(db.Float)
    max_width = db.Column(db.Float)
    min_width = db.Column(db.Float)
    color = db.Column(db.String(120))
    foliage = db.Column(db.String(120))
    climate = db.Column(db.String(120))
    season = db.Column(db.String(20))
    sun_requirement = db.Column(db.String(120))
    soil_moisture = db.Column(db.String(120))
    frost_tolerance = db.Column(db.Integer)
    soil_type = db.Column(db.String(120))
    ph_from = db.Column(db.Float)
    ph_to = db.Column(db.Float)
    plant_type = db.Column(db.String(120))


    def __repr__(self):
        return {'plant_name': str(self.plant_name),
                'scientific_name': str(self.scientific_name),
                'height': str(self.min_height) + " - " + str(self.max_height),
                'width': str(self.min_width) + " - " + str(self.max_width),
                'climate': str(self.climate),
                'sun_requirement': str(self.sun_requirement),
                'soil_moisture': str(self.soil_moisture),
                'season': str(self.season),
                'plant_type': str(self.plant_type),
                'color': str(self.color),
                'foliage': str(self.foliage),
                'soil_type': str(self.soil_type)}
