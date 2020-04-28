from flask import Blueprint, render_template, request, jsonify
from apps.models.plant import Plant
from apps.models.cities import City
from sqlalchemy.orm import sessionmaker
# from manage import mysql


main_bp = Blueprint('main', __name__, url_prefix='/')


@main_bp.route('/')
def index():
    return render_template("index.html")


@main_bp.route('/about/')
def about():
    return render_template("about_us.html")


@main_bp.route('/search/')
def search():
    return render_template('search.html')


@main_bp.route('/calculator/')
def calculator():
    return render_template("calculator.html")


@main_bp.route('/planting_tips')
def planting_tips():
    return  render_template("planting_tips.html")


@main_bp.route('/results')
def results():
    post_code = request.args.get('postCode')

    ph_max = 0
    ph_min = 0
    search_results = None
    ph_requirements = None
    results_json = {"status_code": 200}

    if post_code:
        try:
            int(post_code)
            ph_requirements = City.query.filter_by(post_code=post_code).first()
        except ValueError:
            ph_requirements = City.query.filter_by(city_name=post_code).first()
        if ph_requirements:
            ph_min = ph_requirements.__repr__()['ph_from']
            ph_max = ph_requirements.__repr__()['ph_to']
        else:
            results_json["error_information"] = "Sorry, the post code or city name your entered is not valid."
            results_json["status_code"] = 204
            return jsonify(results_json)
        print("======")
        print(ph_min)
        print(ph_max)
        print("======")
        search_results = Plant.query.filter(Plant.ph_from <= ph_min, Plant.ph_to >= ph_max).all()
    else:
        search_results = Plant.query.all()

    if search_results:
        results_json["plants"] = []
        for p in search_results:
            results_json["plants"].append(p.__repr__())
    else:
        results_json["error_information"] = "Sorry, no result found..."
        results_json["status_code"] = 204
    return jsonify(results_json)


@main_bp.route('/filter_results/')
def filter_result():
    from manage import mysql
    ph_max = 0
    ph_min = 0
    search_results = None
    ph_requirements = None
    results_json = {"status_code": 200}
    sql = "select * from plant"
    post_code = request.args.get('postCode')
    add_on = " where "

    if post_code:
        try:
            int(post_code)
            ph_requirements = City.query.filter_by(post_code=post_code).first()
        except ValueError:
            ph_requirements = City.query.filter_by(city_name=post_code).first()

        if ph_requirements:
            ph_max = ph_requirements.__repr__()['ph_to']
            ph_min = ph_requirements.__repr__()['ph_from']
            sql = "select * from plant where ph_from <= " + str(ph_min) + " and ph_to >= " + str(ph_max)
            add_on = " and "
        else:
            results_json["error_information"] = "Sorry, the post code or city name your entered is not valid."
            results_json["status_code"] = 204
            return jsonify(results_json)

    where_sql = {"sun_requirement": [],
                 "water_requirement": [],
                 "color": [],
                 "season": []}

    true_value = ['true']

    sun_full = request.args.get('sunFull') in true_value
    sun_partial = request.args.get('sunPartial') in true_value
    shade_full = request.args.get('shadeFull') in true_value
    if sun_full and sun_partial and shade_full:
        pass
    elif not shade_full and not sun_partial and not shade_full:
        pass
    else:
        if sun_full:
            where_sql["sun_requirement"].append("sun_requirement like '%full sun%'")
        if sun_partial:
            where_sql["sun_requirement"].append("sun_requirement like '%partial sun%'")
        if shade_full:
            where_sql["sun_requirement"].append("sun_requirement like '%full shade%'")

    water_medium = request.args.get('waterMedium')
    water_low = request.args.get('waterLow')
    if water_medium and water_low:
        pass
    elif not water_medium and not water_low:
        pass
    else:
        if water_medium:
            where_sql["water_requirement"].append("soil_moisture like '%medium%'")
        if water_low:
            where_sql["water_requirement"].append("soil_moisture like '%low%'")

    color_green = request.args.get('colorGreen') in true_value
    color_yellow = request.args.get('colorYellow') in true_value
    color_other = request.args.get('colorOther') in true_value
    if color_green and color_yellow and color_other:
        pass
    elif not color_green and color_yellow and color_other:
        pass
    else:
        if color_green:
            where_sql["color"].append("foliage like '%green%'")
        if color_yellow:
            where_sql["color"].append("foliage like '%yellow%'")
        if color_other:
            where_sql["color"].append("(foliage not like '%green%' and foliage not like '%yellow%')")

    season_spring = request.args.get('seasonSpring') in true_value
    season_summer = request.args.get('seasonSummer') in true_value
    season_autumn = request.args.get('seasonAutumn') in true_value
    season_winter = request.args.get('seasonWinter') in true_value
    if season_spring and season_summer and season_autumn and season_winter:
        pass
    elif not season_spring and not season_summer and not season_autumn and not season_winter:
        pass
    else:
        where_sql["season"].append("season like '%all year%'")
        if season_spring:
            where_sql["season"].append("season like '%spring%'")
        if season_summer:
            where_sql["season"].append("season like '%summer%'")
        if season_autumn:
            where_sql["season"].append("season like '%autumn%'")
        if season_winter:
            where_sql["season"].append("season like '%winter%'")

    and_sql = []

    for i in where_sql.values():
        if i:
            sub_sql = "("
            for j in range(len(i)):
                if j == (len(i) - 1):
                    sub_sql += i[j]
                    sub_sql += ")"
                else:
                    sub_sql += i[j]
                    sub_sql += " or "
            and_sql.append(sub_sql)

    if and_sql:
        sql += add_on

    for i in range(len(and_sql)):
        if i == (len(and_sql) - 1):
            sql += and_sql[i]
            sql += ";"
        else:
            sql += and_sql[i]
            sql += " and "

    cursor = mysql.connection.cursor()
    cursor.execute(sql)
    res = cursor.fetchall()
    if res:
        results_json["plants"] = res
    else:
        results_json["status_code"] = 204
        results_json["error_information"] = "Sorry, no result found..."
    return jsonify(results_json)
