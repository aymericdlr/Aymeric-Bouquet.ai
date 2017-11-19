//all the function used by the HTML page except the AJAX request 



//global variable for the chart
let myChart;

//we load we display the datas of the last available month which is June 2017
document.getElementById("year").value="2017";         
document.getElementById("month").value="06";         
document.getElementById("text_title").innerHTML="Data for 06/2017 in Marin County"
ajaxGet("https://data.marincounty.org/resource/mw3d-ud6d.json?month_and_year=2017-06-01T00:00:00.000", function (reponse) {
    createBarChart(reponse);
});

//function called when we open for the first time
createBarChart= function (response) {
    let chart_data=prepareData(response);
    let labels_BarChart=chart_data[0];
    let data_BarChart=chart_data[1];
    let total=chart_data[2];

    //case if there is no data to display
    if(labels_BarChart.length===0){
        alert("No data available for the selected month and year");
        return
    }
    //display the total amount for this month
    let total_amount=document.getElementById("total");
    total_amount.innerHTML="Total: "+total+"$ ";

    //creation of the Bar Chart
    myChart=new Chart(document.getElementById("bar-chart"), {
        type: 'bar',
        data: {
            labels: labels_BarChart,
            datasets: [
                {
                    label: "Amount in Dollars",
                    backgroundColor: "#3e95cd",
                    data: data_BarChart,
                    hoverBackgroundColor: '#c25f53'
                }
            ]
        },
        options: {
            animation:0,
            tooltips: {                     //informations when hover
                enabled: true,
                displayColors: false,
                mode: 'label',
                callbacks: {
                    title: function(tooltipItems, data) {  //title of tooltip
                        let idx = tooltipItems[0].index;
                        return  data.labels[idx]
                    }
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        callback: function(value) {
                            return value.substr(0, 10)+"..";//truncate the Xlabels
                        },
                    }
                }],
                yAxes: [{}]
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: { display: false },
            title: {
                display: true,
                text: 'Amount in USD by department'
            }
        }
    });
}




updateData=function(){
    //get month and year and update title of the page
    let month=document.getElementById("month").value;
    let year=document.getElementById("year").value;

    url="https://data.marincounty.org/resource/mw3d-ud6d.json?month_and_year=";
    ajaxGet(url+year+"-"+month+"-01T00:00:00.000", function (response) {

        let chart_data=prepareData(response);
        let labels_BarChart=chart_data[0];
        let data_BarChart=chart_data[1];
        let total=chart_data[2];

        //case if there is no data to display
        if(labels_BarChart.length===0){
            alert("No data available for the selected month and year");
            return
        }
        document.getElementById("text_title").innerHTML="Data for "+month+"/"+year+" in Marin County"; //change the title

        //display the total amount for this month
        let total_amount=document.getElementById("total");
        total_amount.innerHTML="Total: "+total+"$ ";

        //we clear the old datas and we add new ones
        removeData(myChart);
        addData(myChart, labels_BarChart, data_BarChart);
    });
}




removeData=function(chart) {
    chart.data.labels=[];
    chart.data.datasets[0].data=[];
    chart.update({
        duration: "0"
    });
}


addData=function(chart, label, data) {
    chart.data.labels=label;
    chart.data.datasets[0].data=data;
    chart.update({
        duration: "0"
    });
}


//preparation of the datas to fill the barCharts. The departments are sorted in alphabet order
prepareData=function(response){
    let data = JSON.parse(response);
    let dict={}
    let labels_BarChart=[];
    let data_BarChart=[];
    let total=0;

    let sorted_keys=[];

    //creation of a dictionnary to store the total amount of transaction per department
    try{
        for (let i = 1; i <= data.length ; i++){
            let amount=parseInt(data[i].amount);
            let department=data[i].department;
            if(dict[department]){
                dict[department]=dict[department]+amount;
            }else{
                dict[department]=amount;
                sorted_keys.push(department);
            }
        }
    }
    catch(e){
        console.log("Waiting for data");
    }

    sorted_keys.sort();

    for (let i in sorted_keys){
        key=sorted_keys[i]
        labels_BarChart.push(key);
        data_BarChart.push(dict[key]);
        total+=dict[key];
    }
    return [labels_BarChart, data_BarChart, total]
}





