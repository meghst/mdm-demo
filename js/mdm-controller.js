angular.module("mdmUI",['ngRoute','ngTable', 'ngTableExport','schemaForm']).controller('dashboard', function($scope, $http,ngTableParams) {
    
    $scope.displayMenu=true
    $scope.entityList=[]
    $scope.entitySchemas={}
    $scope.entityFormSchemas={}
    $scope.columns=[]
    $scope.data={}
    $scope.showTabs=false
    $scope.forms={}
    

    $('#myTab a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    })

    //get entities list
    $http.get("get_entity_list.php").success(function(entityList)
    {
        $scope.entityList=entityList;
        for(var i in $scope.entityList) 
        {
            $http.get("get_entity_schema.php?entityType="+encodeURIComponent($scope.entityList[i]))
            .success(function(data)
            {
                
                $scope.entitySchemas[data.name]=data;
                $scope.entityFormSchemas[data.name]=$scope.convertSchema(data)
                $scope.forms[data.name]=[
                    "*",
                    {
                        type:"submit",
                        title:"Create"
                    }
                ]
                $scope.model={};
                
            });
        }
    });


    $scope.convertSchema=function(data)
    {
        var schema={}
        schema["type"]="object"
        schema["title"]=data["displayName"]
        schema["properties"]={}
        for (var index in data["fields"])
        {

            field=data["fields"][index]
            
            if(field.visible)
             {
                name=field.name
                // console.log(name)
                schema["properties"][name]={}
                schema["properties"][name]["title"]=field.displayName
                //console.log(field.type)
                if(field.type=="array")
                 {   
                    //console.log(field.type)
                    schema["properties"][name].type="array"
                    schema["properties"][name].items=field.items

                }
                else if(field.type=="dependent")
                {
                    schema["properties"][name]["type"]="string"

                    schema["properties"][name]["enum"]=$scope.getEnum(field.url)
                }
                else
                {
                    schema["properties"][name]["type"]=field.type
                }
                // console.log(field)
            }

        }
        console.log(schema)
        return schema

    }
    $scope.getEnum=function(url)
    {
        enum_list=[]
        $http.get(field.url)
                    .success(function (data)
                    {
                        enum_list=data
                    });

        return enum_list
    }
    $scope.selectEntity=function(entityName)
    {
        $scope.columns=[]
        $scope.data={}
        $scope.showTabs=true
        $scope.currentEntity=entityName
        geturl=$scope.entitySchemas[entityName].url
        $http.get(geturl).success(function(data){
                       $scope.data=data
                       $scope.generateTable()
                    })

        // BootstrapDialog.show({
        //     title: $scope.entitySchemas[entityName],
        //     message: function() {
        //         var $content = $('<div style="text-align:center"> \
        //             <button id="display" class="btn btn-default" style="margin-right:10px">Display</button> \
        //             <button id="create" class="btn btn-primary" style="margin-right:10px">Create</button> \
        //             <button id="update" class="btn btn-warning" style="margin-right:10px">Update</button> \
        //             <button id="delete" class="btn btn-danger" style="margin-right:10px">Delete</button> \
        //             </div>');

        //         $content.find("#display").click(function (){

        //             BootstrapDialog.closeAll()
        //             geturl=$scope.entitySchemas[entityName].url
        //             $http.get(geturl).success(function(data){
        //                $scope.data=data
        //                $scope.generateTable()
        //             })

        //         })

        //         $content.find("#create").click(function (){
        //             BootstrapDialog.closeAll()
        //         })

        //         $content.find("#update").click(function (){
        //             BootstrapDialog.closeAll()
        //         })


        //         $content.find("#delete").click(function (){
        //             BootstrapDialog.closeAll()
        //         })

        //         return $content;
        //     }
        // });


    }

    $scope.generateTable = function() {

        $scope.fields=$scope.entitySchemas[$scope.currentEntity].fields
        
        for(var field in $scope.fields)
        {

            column={
                "title": $scope.fields[field].displayName,
                "field":$scope.fields[field].name,
                "show":$scope.fields[field].visible
            }
            console.log(column)
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

