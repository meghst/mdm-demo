angular.module("mdmUI",['ngRoute','ngTable', 'ngTableExport']).controller('dashboard', function($scope, $http,ngTableParams) {
    
    $scope.displayMenu=true
    $scope.entityList=[]
    $scope.entitySchemas={}
    $scope.columns=[]
    $scope.data={}
    $scope.showTable=false

    //get entities list
    $http.get("get_entity_list.php").success(function(entityList)
    {
        $scope.entityList=entityList;
        // console.log("scope.entityList=",$scope.entityList)

        //get schemas for each entity list
        for(var i in $scope.entityList) 
        {
            // console.log(i)
            // console.log(encodeURIComponent($scope.entityList[i]))
            $http.get("get_entity_schema.php?entityType="+encodeURIComponent($scope.entityList[i]))
            .success(function(data)
            {
                

                $scope.entitySchemas[data.name]=data;
                // console.log($scope.entitySchemas)
            });
        }
    });

    $scope.selectEntity=function(entityName)
    {
        $scope.columns=[]
        $scope.data={}
        $scope.showTable=false
        //console.log(entityName)
        $scope.currentEntity=entityName
        BootstrapDialog.show({
            title: $scope.entitySchemas[entityName].displayName,
            message: function() {
                var $content = $('<div style="text-align:center"> \
                    <button id="display" class="btn btn-default" style="margin-right:10px">Display</button> \
                    <button id="create" class="btn btn-primary" style="margin-right:10px">Create</button> \
                    <button id="update" class="btn btn-warning" style="margin-right:10px">Update</button> \
                    <button id="delete" class="btn btn-danger" style="margin-right:10px">Delete</button> \
                    </div>');

                $content.find("#display").click(function (){

                    BootstrapDialog.closeAll()
                    geturl=$scope.entitySchemas[entityName].url

                    //get table template and load into #table

                    //$("#table").load("table.html")

                    
                    $http.get(geturl).success(function(data){
                        //console.log(data)
                        //$scope.data=data;
                       $scope.data=data
                       $scope.generateTable()
                    })

                })

                $content.find("#create").click(function (){
                    BootstrapDialog.closeAll()
                    // console.log("create")
                })

                $content.find("#update").click(function (){
                    BootstrapDialog.closeAll()
                    // console.log("update")
                })


                $content.find("#delete").click(function (){
                    BootstrapDialog.closeAll()
                    // console.log("delete")
                })

                return $content;
            }
        });


    }

    $scope.generateTable = function() {

        //console.log($scope.data)
        $scope.fields=$scope.entitySchemas[$scope.currentEntity].fields
        
        for(var field in $scope.fields)
        {

            column={
                "title": $scope.fields[field].title,
                "field":$scope.fields[field].name,
                "show":$scope.fields[field].visible
            }
            $scope.columns.push(column)
        }
        //console.log("columns:",$scope.columns)
        $scope.showTable=true
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: $scope.data.length, // length of data
            getData: function($defer, params) {
                $defer.resolve($scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
             $scope: { $data: {} }
        });
    }





});

