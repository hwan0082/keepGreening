$(document).ready(function () {

    $('.carousel').carousel({
        interval: 2000
    });

    let show_options = $("#show-options");
    show_options.css({visibility: "hidden"});
    show_options.hide();
    show_options.css({visibility: "visible"});
    let search_options = $(".search-options");
    search_options.css({visibility: "hidden"});
    search_options.hide();
    search_options.css({visibility: "visible"});
    let plant_type_options = $(".plant-type-options");
    plant_type_options.css({visibility: "hidden"});
    plant_type_options.hide();
    plant_type_options.css({visibility: "visible"});

    show_options.click(function () {
        let filterButtonContainer = $(".search-options");
        show_div(filterButtonContainer);
    });

    let container = $('#result-container');
    let back_to_top = $(".back-to-top");
    set_margin_bottom(container);
    set_margin_bottom(back_to_top);

    $("#clear-filter").click(function () {
        clear_filters();
    });

    let postCode;
    let carbonPlannerAmt = 0;
    let plants_data;
    let default_filters =
        {
            "spring": false,
            "summer": false,
            "winter": false,
            "fall": false,
            "full-sun": false,
            "partial-sun": false,
            "full-shade": false,
            "low": false,
            "medium": false,
            "high": false,
            "red": false,
            "pink": false,
            "orange": false,
            "yellow": false,
            "green": false,
            "purple": false,
            "mauve": false,
            "white": false,
            "black": false,
            "ground-covers": false,
            "small-shrubs": false,
            "medium-shrubs": false,
            "large-shrubs": false,
            "trees": false,
            "grasses": false,
            "climbers": false
        };
    let filter_selected_status = $.extend({}, default_filters);

    $("#search-button").click(function () {
        filter_selected_status = $.extend({}, default_filters);
        postCode = $("#inlineFormInput").val();
        clear_result_containers();
        clear_filter_containers();
        clear_filters();
        add_loader();

        $.getJSON("/results", {
            postCode: postCode
        }, function (data) {
            clear_result_containers();
            let resultContainer = $("#result-container");

            if (data.status_code === 204) {
                resultContainer.append('<h2 id="error-information" class="row"></h2>');
                $("#error-information").text(data.error_information);
            } else {
                plants_data = data.plants;
                render_results(plants_data, resultContainer);

                show_options.css({visibility: "visible"});
                show_options.show();
                plant_type_options.css({visibility: "visible"});
                plant_type_options.show();
            }
        });
    });

    $(".filter-basic").click(function () {
        let btn = $(this);

        change_filter_status(btn, filter_selected_status);
        get_filtered_results(plants_data, filter_selected_status);
    });

    let view_detail = $(".view-detail");
    view_detail.hide();

    view_detail.click(function () {
        show_plan_list();
    });

    function show_filters() {
        let filterButtonContainer = $(".search-options");
        show_div(filterButtonContainer);
        let filterContainer = $("#show-options");
        show_div(filterContainer);
        let plantTypeContainer = $(".plant-type-options");
        show_div(plantTypeContainer);
    }

    function clear_filters() {
        $('.filter-basic').each(function () {
            let btn = $(this);
            btn.removeClass();
            btn.addClass("btn filter-basic filter-button-unselected");
        })
    }

    function clear_result_containers() {
        let resultContainer = $("#result-container");
        resultContainer.html("");
        let resultButtonContainer = $(".result-button-container");
        resultButtonContainer.html("");
    }

    function clear_filter_containers() {
        let filterContainer = $("#show-options");
        filterContainer.css({"visibility": "visible"});
        filterContainer.hide();
        let filterButtonContainer = $(".search-options");
        filterButtonContainer.css({"visibility": "visible"});
        filterButtonContainer.hide();
        let plantTypeContainer = $(".plant-type-options");
        plantTypeContainer.css({"visibility": "visible"});
        plantTypeContainer.hide();
    }

    function add_loader() {
        let resultContainer = $("#result-container");
        resultContainer.html("<div class='loader'></div>");
    }

    function change_filter_status(btn, filter_selected_status) {
        let id_name = btn.attr("id");
        let new_status = !filter_selected_status[id_name];
        filter_selected_status[id_name] = new_status;
        if (new_status) {
            btn.removeClass("filter-button-unselected");
            btn.addClass("filter-button-selected");
        } else {
            btn.removeClass("filter-button-selected");
            btn.addClass("filter-button-unselected");
        }

        let resultButtonContainer = $(".result-button-container");
        resultButtonContainer.html("");
    }

    function season_tested_dict(filter_selected_status) {
        let values = ["spring", "summer", "autumn", "winter"];
        let tested_values = [];

        $.each(values, function (index, value) {
            if (filter_selected_status[value]) {
                tested_values.push(id_formatter(value));
            }
        });

        let dict = {};
        let values_length = values.length;
        let tested_values_length = tested_values.length;
        dict["tested_values"] = tested_values;

        dict["compare_length"] = (tested_values_length === 0 || tested_values_length === values_length);

        return dict;
    }

    function sun_tested_dict(filter_selected_status) {
        let values = ["full-sun", "partial-sun", "full-shade"];
        let tested_values = [];

        $.each(values, function (index, value) {
            if (filter_selected_status[value]) {
                tested_values.push(id_formatter(value));
            }
        });

        let dict = {};
        let values_length = values.length;
        let tested_values_length = tested_values.length;

        dict["tested_values"] = tested_values;
        dict["compare_length"] = (tested_values_length === 0 || tested_values_length === values_length);

        return dict;
    }

    function water_tested_dict(filter_selected_status) {
        let values = ["low", "medium", "high"];
        let tested_values = [];

        $.each(values, function (index, value) {
            if (filter_selected_status[value]) {
                tested_values.push(id_formatter(value));
            }
        });

        let dict = {};
        let values_length = values.length;
        let tested_values_length = tested_values.length;

        dict["tested_values"] = tested_values;
        dict["compare_length"] = (tested_values_length === 0 || tested_values_length === values_length);

        return dict;
    }

    function color_tested_dict(filter_selected_status) {
        let values = ["red", "pink", "orange", "yellow", "green", "purple", "mauve", "white", "black"];
        let tested_values = [];

        $.each(values, function (index, value) {
            if (filter_selected_status[value]) {
                tested_values.push(id_formatter(value));
            }
        });

        let dict = {};
        let values_length = values.length;
        let tested_values_length = tested_values.length;

        dict["tested_values"] = tested_values;
        dict["compare_length"] = (tested_values_length === 0 || tested_values_length === values_length);

        return dict;
    }

    function type_tested_dict(filter_selected_status) {
        let values = ["ground-covers", "small-shrubs", "medium-shrubs", "large-shrubs", "trees", "grasses", "climbers"];
        let tested_values = [];

        $.each(values, function (index, value) {
            if (filter_selected_status[value]) {
                tested_values.push(id_formatter(value));
            }
        });

        let dict = {};
        let values_length = values.length;
        let tested_values_length = tested_values.length;

        dict["tested_values"] = tested_values;
        dict["compare_length"] = (tested_values_length === 0 || tested_values_length === values_length);

        return dict;
    }

    function check_season_results(dict, plant) {
        if (plant.season === "All year") {
            return true;
        }

        return (dict["compare_length"] || dict["tested_values"].includes(plant.season));
    }

    function check_sun_results(dict, plant) {
        return (dict["compare_length"] || dict["tested_values"].includes(plant.sun_requirement));
    }

    function check_water_results(dict, plant) {
        return (dict["compare_length"] || dict["tested_values"].includes(plant.soil_moisture));
    }

    function check_color_results(dict, plant) {
        return (dict["compare_length"] || dict["tested_values"].includes(plant.color));
    }

    function check_type_results(dict, plant) {
        return (dict["compare_length"] || dict["tested_values"].includes(plant.plant_type));
    }

    function get_filtered_results(plants_data, filter_selected_status) {
        clear_result_containers();
        add_loader();
        let filtered_plants_data = [];

        let season_dict = season_tested_dict(filter_selected_status);
        let sun_dict = sun_tested_dict(filter_selected_status);
        let water_dict = water_tested_dict(filter_selected_status);
        let color_dict = color_tested_dict(filter_selected_status);
        let type_dict = type_tested_dict(filter_selected_status);

        $.each(plants_data, function (index, plant) {
            if (!check_season_results(season_dict, plant)) {
                return;
            }
            if (!check_sun_results(sun_dict, plant)) {
                return;
            }
            if (!check_water_results(water_dict, plant)) {
                return;
            }
            if (!check_color_results(color_dict, plant)) {
                return;
            }
            if (!check_type_results(type_dict, plant)) {
                return;
            }

            filtered_plants_data.push(plant);
        });

        clear_result_containers();
        let resultContainer = $("#result-container");
        if (filtered_plants_data.length > 0) {
            render_results(filtered_plants_data, resultContainer);
        } else {
            resultContainer.html("<h5 class='row'>Sorry, No result found...</h5>");
        }

    }

    function id_formatter(id_name) {
        let id_formatted = id_name.split("-");
        for (let i = 0; i < id_formatted.length; i++) {
            id_formatted[i] = id_formatted[i].charAt(0).toUpperCase() + id_formatted[i].slice(1);
        }
        id_formatted = id_formatted.join(" ");
        return id_formatted
    }

    function add_quantity(button) {
        let input = button.closest('td').find(".input-quantity");
        let quantity = parseInt(input.val());
        let plantType = button.closest('td').closest('tr').find('.plant-type').text();
        quantity += 1;
        carbonPlannerAmt = carbon_planner(plantType, 1);
        input.val(quantity);
        let class_list = button.attr("class").split(" ");
        let tested_class = "view-detail-plus";
        if (!class_list.includes(tested_class)) {
            $(".view-detail").show();
        }

        let row = button.parent().parent();
        find_plant(row, quantity);

        return carbonPlannerAmt;
    }

    function minus_quantity(button) {
        let input = button.closest('td').find(".input-quantity");
        let quantity = parseInt(input.val());
        let plantType = button.closest('td').closest('tr').find('.plant-type').text();
        quantity -= 1;
        let row = button.parent().parent();

        if (quantity >= 0) {
            carbonPlannerAmt = carbon_planner(plantType, -1);
            input.val(quantity);
            find_plant(row, quantity);
        } else {
            input.val(0);
            quantity = 0;
            find_plant(row, quantity);
        }
        return carbonPlannerAmt;
    }

    function reset_quantity(button) {
        let input = button.closest('td').prev('td').find(".input-quantity");
        let quantity = parseInt(input.val());
        let plantType = button.closest('td').closest('tr').find('.plant-type').text();
        carbonPlannerAmt = carbon_planner(plantType, -1 * quantity);
        input.val("0");

        let row = button.parent();
        find_plant(row, 0);

        return carbonPlannerAmt;
    }

    function reset_all_quantities() {
        $(".input-quantity").each(function (index, element) {
            $(element).val("0");
        });
        $(".view-detail").hide();

        carbonPlannerAmt = 0;

        $.each(plants_data, function (index, plant) {
            plant["qty"] = 0;
        });
    }

    function show_div(container) {
        let display = container.css("display");

        if (display === "none") {
            container.show();
        } else {
            container.hide();
        }
    }

    function add_table_header(resultCount) {
        let resultContainer = $("#result-container");
        let resultButtonContainer = $(".result-button-container");

        let result_count = '<div class="row"><h5 id="show-results"></h5></div>';
        resultButtonContainer.append(result_count);
        let showResults = $("#show-results");
        showResults.text(resultCount + " results");

        let tableHead = '<div class="row"><table class="table table-responsive"><thead><tr class="column-names"></tr></thead><tbody class="container"></tbody></table></div>';
        resultContainer.append(tableHead);

        let columnNames = $('.column-names');
        columnNames.append('<th scope="col">Name</th>');
        columnNames.append('<th scope="col">Sunlight Requirement</th>');
        columnNames.append('<th scope="col">Water Requirement</th>');
        columnNames.append('<th scope="col">Color</th>');
        columnNames.append('<th scope="col">Season</th>');
        columnNames.append('<th scope="col">Soil Type</th>');
        columnNames.append('<th scope="col">Plant Type</th>');
        columnNames.append('<th scope="col" class="manipulation-title">Manipulation</th>');
        columnNames.append('<th scope="col"><button class="manipulation btn-success reset clear">Clear</button></th>');
    }

    function add_table_rows(plant) {
        let plantInfo = $("<tr></tr>");
        $("tbody").append(plantInfo);
        plantInfo.append("<td class='plant-name'>" + plant.plant_name + "</td>");
        plantInfo.append("<td class='sun-requirement'>" + plant.sun_requirement + "</td>");
        plantInfo.append("<td class='soil-moisture'>" + plant.soil_moisture + "</td>");
        plantInfo.append("<td class='color'>" + plant.color + "</td>");
        plantInfo.append("<td class='season'>" + plant.season + "</td>");
        plantInfo.append("<td>" + plant.soil_type + "</td>");
        plantInfo.append("<td class='plant-type'>" + plant.plant_type + "</td>");
        if (plant.qty) {
            plantInfo.append('<td><button class="manipulation btn-success minus">-</button>' +
                '<input type="text" class="input-quantity" value="' + (plant.qty).toString() + '" disabled>' +
                '<button class="manipulation btn-success plus">+</button></td>');
        } else {
            plantInfo.append('<td><button class="manipulation btn-success minus">-</button>' +
                '<input type="text" class="input-quantity" value="0" disabled>' +
                '<button class="manipulation btn-success plus">+</button></td>');
        }
        plantInfo.append('<td><button class="manipulation btn-success reset">Reset</button></td>');
    }

    function carbon_planner(plantType, constant) {
        let carbonEmission = 0.2;
        let shrubsLg = 22;
        let shrubMd = 5;
        let shrubSm = 1;
        let tree = 69;
        let grass = .19;
        let groundCover = 7;
        let climber = 10;
        let calculation_data = {
            "Ground Covers": groundCover,
            "Small Shrubs": shrubSm,
            "Medium Shrubs": shrubMd,
            "Large Shrubs": shrubsLg,
            "Trees": tree,
            "Grasses": grass,
            "Climbers": climber
        };

        carbonPlannerAmt += calculation_data[plantType] * constant;
        if (carbonPlannerAmt < 0) {
            carbonPlannerAmt = 0;
        }

        if (carbonPlannerAmt === 0) {
            $(".view-detail").hide();
        }

        $("#carbon-absorb").text(carbonPlannerAmt.toFixed(2));
        $("#carbon-absorb-title").text(carbonPlannerAmt.toFixed(2) + " kg carbon");
        $("#car-emmit").text((carbonPlannerAmt / carbonEmission).toFixed(2));

        return carbonPlannerAmt;
    }

    function render_results(plants_data, resultContainer) {
        let resultCount = plants_data.length;
        add_table_header(resultCount);

        $.each(plants_data, function (index, plant) {
            add_table_rows(plant);
        });

        $(".plus").click(function () {
            let button = $(this);
            carbonPlannerAmt = add_quantity(button);
        });

        $(".minus").click(function () {
            let button = $(this);
            carbonPlannerAmt = minus_quantity(button);
        });

        $(".reset").click(function () {
            let button = $(this);
            carbonPlannerAmt = reset_quantity(button);
        });

        $(".clear").click(function () {
            carbonPlannerAmt = 0;
            $("#carbon-absorb").text(0);
            $("#car-emmit").text(0);
            reset_all_quantities();
        });
    }

    function set_margin_bottom(container) {
        let height = $('.fixed-bottom').innerHeight();
        height = parseInt(height) + 10;
        height = height.toString() + 'px';
        container.css({'margin-bottom': height});
    }

    function show_plan_list() {
        $(".search-options-container .row").hide();
        $(".result-button-container").hide();

        $(".search-options-container").append("<div class='plan-title row'>" +
            "<button class='btn green-button btn-success' id='back-to-search'>Back to search</button>" +
            "<h2>The following plants can absorb <span id='carbon-absorb-title' style='color: rgb(113, 185, 115)'>" + $("#carbon-absorb").text() + ' kg carbon' + "</span> annually.</h2>" +
            "</div>");

        $(".search-options-container").append("<div class='send-email-row row'>" +
            "<input class='form-control col-6' id='email-input' type='email'>" +
            "<button type='submit' class='col-2 btn btn-success mb-2 green-button-2' id='send-email'>Send Email</button>" +
            "</div>");

        $(".search-options-container").append("<span class='row email-error-span'></span>");

        $(".fixed-bottom .container .row").hide();
        $(".fixed-bottom .container").append("<h4 class='row plant-tips-redirect'>Click if you want some advice on planting trees.&nbsp;&nbsp;<a class='btn learn-more btn-success to-calculator'>Calculator</a></h4>");
        $(".reset").hide();
        $(".view-detail").hide();
        $(".input-quantity").each(function () {
            let quantity = parseInt($(this).val());
            if (quantity === 0) {
                $(this).parent().parent().hide();
            } else {
                $(this).parent().find(".plus").addClass("view-detail-plus");
                $(this).parent().find(".minus").addClass("view-detail-minus");
            }
        });

        $("#back-to-search").click(function () {
            back_to_search();
        });

        $("#send-email").click(function () {
            send_email();
        });

        $(".to-calculator").click(function () {
            to_calculator();
        });
    }

    function back_to_search() {
        $(".plan-title").remove();
        $(".plant-tips-redirect").remove();
        $(".send-email-row").remove();
        $(".email-error-span").remove();

        $(".search-options-container .row").show();
        $(".search-options").hide();

        $(".result-button-container").show();
        $(".fixed-bottom .container .row").show();
        $(".reset").show();
        $(".view-detail").show();
        $(".input-quantity").each(function () {
            $(this).parent().find(".plus").removeClass("view-detail-plus");
            $(this).parent().find(".minus").removeClass("view-detail-minus");
            $(this).parent().parent().show();
        });
    }

    function send_email() {
        let email = $("#email-input").val();
        let email_error_span = $(".email-error-span");

        let table = [];
        $("table .container tr").each(function () {
            let row = $(this);
            let display = row.css("display");
            if (display === "table-row") {
                let temp_dict = {};
                temp_dict['plant_name'] = row.children(".plant-name").text();
                temp_dict['sun_requirement'] = row.children(".sun-requirement").text();
                temp_dict['soil_moisture'] = row.children(".soil-moisture").text();
                temp_dict['color'] = row.children(".color").text();
                temp_dict['season'] = row.children(".season").text();
                temp_dict['plant_type'] = row.children(".plant-type").text();
                temp_dict['qty'] = row.children("td").children('.input-quantity').val();
                table.push(temp_dict);
            }
        });

        if (validate_email(email)) {
            $.getJSON("/send_email", {
                email: email,
                table: JSON.stringify(table)
            }, function (data) {
                if (data.status_code === 204) {
                    email_error_span.css({"color": "red"});
                    email_error_span.text('Fail to send email. Please try again.');
                } else if (data.status_code === 400) {
                    email_error_span.css({"color": "red"});
                    email_error_span.text('Fail to send email. Please try again later.');
                } else {
                    email_error_span.css({"color": "green"});
                    email_error_span.text('Email has been successfully sent.');
                }
            });
        } else {
            email_error_span.css({"color": "red"});
            email_error_span.text("Email format is not valid, please re-enter your email.");
        }
    }

    function validate_email(email) {
        let emailExp = new RegExp(/^\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i);

        return emailExp.test(email);
    }

    function to_calculator() {
        let qty = parseFloat($("#carbon-absorb-title").text());
        console.log(qty);
        $(".to-calculator").attr("href", "/calculator/" + qty);
    }

    function find_plant(row, quantity) {
        let plant_name = row.children(".plant-name").text();
        let sun_requirement = row.children(".sun-requirement").text();
        let soil_moisture = row.children(".soil-moisture").text();
        let color = row.children(".color").text();
        let season = row.children(".season").text();

        $.each(plants_data, function (index, plant) {
            if (plant["plant_name"] === plant_name
                && plant["color"] === color
                && plant["season"] === season
                && plant["soil_moisture"] === soil_moisture
                && plant["sun_requirement"] === sun_requirement) {
                plant["qty"] = quantity;
                return false;
            }
        });
    }
});
