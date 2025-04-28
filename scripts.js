
const departmentMap = {
    "egypt" : 10,
    "knights" : 4,
    "africa" : 5, 
    "decorative" : 1,
    "greek" : 13
}

 
$(document).ready(function(){
    $("#backButton").click(function(){
        const output = document.getElementById("outputImage");
        $("#map_image").show();
        output.src = "";
    });
});

$(document).ready(function(){
    $('area').click(function(){
        console.log(this.title)
        $("#map_image").hide();
        const output = document.getElementById("outputImage");
        const departmentId = departmentMap[this.title];
         fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${departmentId}&q=m`)
             .then(response => {
             if (!response.ok) {
                 throw new Error('Network response was not ok');
             }
             return response.json();
             })
             .then(data => {
               let index = 0;
             function fetchImage() {
                 if (index >= data.objectIDs.length || index >= 20) return; 
                 fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${data.objectIDs[index]}`)
                     .then(response => {
                         if (!response.ok) {
                             throw new Error('Network response was not ok');
                         }
                         return response.json();
                     })
                     .then(data2 => {
                         console.log(data2);
                         if (data2.primaryImageSmall) { 
                             output.src = data2.primaryImageSmall; 
                             return; 
                         } 
                         index++; 
                         fetchImage(); 
                     })
                     .catch(error => console.error(error));
             }
             fetchImage(); 
           });
        

    });
});


/*Debug functions

function clicked(department){
    console.log(`clicked ${department}`);
    
}


window.onload = function(){
    document.getElementById("modern").onmouseenter = function(){clicked("hello");}
}*/