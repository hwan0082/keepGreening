from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from flask_login import LoginManager, login_user, login_required, logout_user
from apps.models.plant import Plant
from apps.models.cities import City
from apps.models.user import User
from sqlalchemy import or_, and_
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import ast


main_bp = Blueprint('main', __name__, url_prefix='/')
login_manager = LoginManager()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@login_manager.unauthorized_handler
def unauthorized():
    return redirect(url_for('.login'))


@main_bp.route('/validate_password', methods=('GET', 'POST'))
def login():
    if request.method == 'GET':
        return render_template('validate_password.html')
    if request.form['password'] == 'keepGreeningE17':
        user = User.query.filter_by(id=1).first()
        login_user(user)
        return redirect(url_for('.index'))
    else:
        error = 'Wrong password'
        return redirect(render_template('validate_password.html', error=error))


@main_bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('.login'))


@main_bp.route('/')
@login_required
def index():
    return render_template("index.html")


@main_bp.route('/gardening_tips/')
@login_required
def gardening_tips():
    return render_template("planting_tips.html")


@main_bp.route('/beginner_tips/')
@login_required
def beginner_tips():
    return render_template("beginner_tips.html")


@main_bp.route('/about')
@login_required
def about():
    return render_template('about_us.html')


@main_bp.route('/grass_tips/')
@login_required
def grass_tips():
    return render_template("grass_tips.html")


@main_bp.route('/shrub_tips/')
def shrub_tips():
    return render_template("shrub_tips.html")


@main_bp.route('/tree_tips/')
@login_required
def tree_tips():
    return render_template("tree_tips.html")


@main_bp.route('/search/')
@login_required
def search():
    return render_template('search.html')


@main_bp.route('/calculator/<qty>')
@login_required
def calculator_qty(qty):
    return render_template("calculator.html", qty=qty)


@main_bp.route('/calculator/')
@login_required
def calculator():
    return render_template("calculator.html")


@main_bp.route('/planting_tips')
@login_required
def planting_tips():
    return render_template("planting_tips.html")


@main_bp.route('/results')
@login_required
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
        search_results = Plant.query.filter(or_(and_(Plant.ph_from <= ph_max, Plant.ph_from >= ph_min),
                                                and_(Plant.ph_to <= ph_max, Plant.ph_to >= ph_min))).all()
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


@main_bp.route('/send_email')
@login_required
def send_email():
    status_code = 204
    email = request.args.get('email')
    table = request.args.get('table')
    table = ast.literal_eval(table)
    content = '<html>' + \
                    '<head>' + \
                    '<title></title>' + \
                    '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" ' + \
                    'integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> ' + \
                    '<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" ' + \
                    'integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" ' + \
                    'crossorigin="anonymous"></script> ' + \
                    '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" ' + \
                    'integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" ' + \
                    'crossorigin="anonymous"></script> ' + \
                    '<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" ' + \
                    'integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" ' + \
                    'crossorigin="anonymous"></script> ' + \
                    '</head>' + \
                    '<body>' + \
                    '<style>th, td{border: 1px solid black;}</style>'
    thead = '<thead><tr class="column-names"><th scope="col">Name</th><th scope="col">Sunlight Requirement</th><th scope="col">Water Requirement</th><th scope="col">Color</th><th scope="col">Season</th><th scope="col">Plant Type</th><th scope="col">Quantity</th><th scope="col"></th></tr></thead>'
    content += '<table class="table table-responsive">'
    content += thead
    content += '<tbody>'
    for tr in table:
        content += '<tr>'
        content += '<td>' + tr['plant_name'] + '</td>'
        content += '<td>' + tr['sun_requirement'] + '</td>'
        content += '<td>' + tr['soil_moisture'] + '</td>'
        content += '<td>' + tr['color'] + '</td>'
        content += '<td>' + tr['season'] + '</td>'
        content += '<td>' + tr['plant_type'] + '</td>'
        content += '<td>' + tr['qty'] + '</td>'
        content += '</tr>'
    content += '</tbody></table></body></html>'
    message = Mail(
        from_email='planner@keepgreening.me',
        to_emails=email,
        subject='Plan for your garden',
        html_content=content)
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        status_code = response.status_code
    except Exception as e:
        print(e)
    result = {"status_code": status_code}
    return jsonify(result)


# To be deleted
@main_bp.route('/filter_results/')
@login_required
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
