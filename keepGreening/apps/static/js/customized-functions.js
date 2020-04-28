function show_filters() {
    let searchDiv = $(".search-options");
    searchDiv.css({"visibility": "visible"});
    show_div(searchDiv);
}

function clear_filters() {
    $(".option-checkbox").each(function (index, element) {
        $(element).prop("checked", false);
    });
}

function add_quantity(button, carbonPlannerAmt) {
    let input = button.closest('td').find(".input-quantity");
    let quantity = parseInt(input.val());
    let plantType = button.closest('td').closest('tr').find('.plant-type').text();
    quantity += 1;
    carbonPlannerAmt = carbon_planner(plantType, carbonPlannerAmt, 1);
    input.val(quantity);
    return carbonPlannerAmt;
}

function minus_quantity(button, carbonPlannerAmt) {
    let input = button.closest('td').find(".input-quantity");
    let quantity = parseInt(input.val());
    let plantType = button.closest('td').closest('tr').find('.plant-type').text();
    quantity -= 1;
    if (quantity >= 0) {
        carbonPlannerAmt = carbon_planner(plantType, carbonPlannerAmt, -1);
        input.val(quantity);
    } else {
        input.val(0);
    }
    return carbonPlannerAmt;
}

function reset_quantity(button, carbonPlannerAmt) {
    let input = button.closest('td').prev('td').find(".input-quantity");
    let quantity = parseInt(input.val());
    let plantType = button.closest('td').closest('tr').find('.plant-type').text();
    carbonPlannerAmt = carbon_planner(plantType, carbonPlannerAmt, -1 * quantity);
    input.val("0");

    return carbonPlannerAmt;
}

function reset_all_quantities() {
    $(".input-quantity").each(function (index, element) {
        $(element).val("0");
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

    let resultButton = '<div class="row"><button type="button" class="learn-more btn btn-success green-button-2 dropdown-toggle col-12" id="show-results"></button></div>';
    resultButtonContainer.append(resultButton);
    let showResults = $("#show-results");
    showResults.text(resultCount + " results");

    let tableHead = '<div class="row"><table class="table table-responsive"><thead><tr class="column-names"></tr></thead><tbody class="container"></tbody></table></div>';
    resultContainer.append(tableHead);

    let columnNames = $('.column-names');
    columnNames.append('<th scope="col">Name</th>');
    columnNames.append('<th scope="col">Sunlight Requirement</th>');
    columnNames.append('<th scope="col">Water Requirement</th>');
    columnNames.append('<th scope="col">Foliage</th>');
    columnNames.append('<th scope="col">Season</th>');
    columnNames.append('<th scope="col">Soil Type</th>');
    columnNames.append('<th scope="col">Plant Type</th>');
    columnNames.append('<th scope="col">Manipulation</th>');
    columnNames.append('<th scope="col"><button class="manipulation btn-success reset clear">Clear</button></th>');
}

function add_table_rows(plant) {
    let plantInfo = $("<tr></tr>");
    $("tbody").append(plantInfo);
    plantInfo.append("<td>" + plant.plant_name + "</td>");
    plantInfo.append("<td>" + plant.sun_requirement + "</td>");
    plantInfo.append("<td>" + plant.soil_moisture + "</td>");
    plantInfo.append("<td>" + plant.foliage + "</td>");
    plantInfo.append("<td>" + plant.season + "</td>");
    plantInfo.append("<td>" + plant.soil_type + "</td>");
    plantInfo.append("<td class='plant-type'>" + plant.plant_type + "</td>");
    plantInfo.append('<td><button class="manipulation btn-success minus">-</button>' +
        '<input type="text" class="input-quantity" value="0" disabled>' +
        '<button class="manipulation btn-success plus">+</button></td>');
    plantInfo.append('<td><button class="manipulation btn-success reset">Reset</button></td>');
}

function carbon_planner(plantType, carbonPlannerAmt, constant) {
    let carbonEmission = 365;
    let shrubsLg = 22;
    let shrubMd = 5;
    let shrubSm = 1;
    let tree = 69;
    let grass = .19;
    let groundCover = 7;
    let climber = 10;
    let calculation_data = {"Ground Covers": groundCover,
        "Small Shrubs": shrubSm,
        "Medium Shrubs": shrubMd,
        "Large Shrubs": shrubsLg,
        "Trees": tree,
        "Grasses": grass,
        "Climbers": climber};

    carbonPlannerAmt += calculation_data[plantType] * constant;

    $("#carbon-absorb").text(carbonPlannerAmt);
    $("#car-emmit").text((carbonPlannerAmt / carbonEmission).toFixed(2));

    return carbonPlannerAmt;
}

function render_results(data, carbonPlannerAmt, resultContainer) {
    $(".search-options").hide();
    let plants = data.plants;
    let resultCount = plants.length;
    add_table_header(resultCount);

    $.each(plants, function (index, plant) {
        add_table_rows(plant);
    });

    $("#show-results").click(function () {
        show_div(resultContainer);
    });

    $(".plus").click(function () {
        let button = $(this);
        carbonPlannerAmt = add_quantity(button, carbonPlannerAmt);
    });

    $(".minus").click(function () {
        let button = $(this);
        carbonPlannerAmt = minus_quantity(button, carbonPlannerAmt);
    });

    $(".reset").click(function () {
        let button = $(this);
        carbonPlannerAmt = reset_quantity(button, carbonPlannerAmt);
    });

    $(".clear").click(function () {
        carbonPlannerAmt = 0;
        $("#carbon-absorb").text(0);
        $("#car-emmit").text(0);
        reset_all_quantities();
    });
}

function loopy() {
    let sWord = ""
    while (sWord != "pass") {
        sWord = prompt("Please enter password")
    }
}
