<?php
// Creating connection
$conn = mysqli_connect('localhost', 'root', '');
// Checking connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error."<br>");
}
else{
    //echo"connection successful<br>";
}

//database and table name
$database='pujan_prototype2_isa';
$table1='current_data';
$table2='past_weather_data';

//checking if database exists or not if not then creating it.
$result = $conn->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '".$database."';");
if ($result->num_rows == 0) {
    // Database does not exist so creating it
    $conn->query("CREATE DATABASE $database;");
    //echo "Database created<br>";
} else {
    //database already exists
    //echo "Database already exists.<br>";
}

// Selecting the database
$conn->select_db($database);

//checking if table1 exists or not
$result = $conn->query("SHOW TABLES LIKE '$table1';");
if ($result->num_rows == 0) {
    // Table does not exist so creating it
    $sql = "CREATE TABLE $table1 (weather_type varchar(10),weather_icon varchar(5),
            main_temp varchar(5),pressure varchar(10),humidity varchar(5),
            visibility float, wind_speed varchar(10),wind_deg varchar(5),time_stamp int(20),country varchar(5),
            timezone int(10),city varchar(10));";
    if ($conn->query($sql) === TRUE) {
        //if table created successfully
        //echo "Table created successfully.<br>";
     } else {
        //if error occured during creating it.
         //echo "Error creating table: " . $conn->error;
    }
} else {
    //table already exists so does nothing
    //echo "Table already exists.<br>";
}

//checking if table2 exists or not
$result = $conn->query("SHOW TABLES LIKE '$table2';");
if ($result->num_rows == 0) {
    // Table does not exist so creating it
    $sql = "CREATE TABLE $table2 (weather_type varchar(10),weather_icon varchar(5),
            main_temp varchar(5),pressure varchar(10),humidity varchar(5),
            visibility float,wind_speed varchar(10), wind_deg varchar(5),time_stamp int(20),country varchar(5),
            timezone int(10),city varchar(10));";
     if ($conn->query($sql) === TRUE) {
        //echo "Table created successfully.<br>";
    } else {
        //echo "Error creating table: " . $conn->error;
    }
} else {
    //echo "Table already exists.<br>";
}

header("Access-Control-Allow-Origin: *" );
//getting city name from the link while running php file
$cityname=isset($_GET['city']) ? $_GET['city']:'';

//part-1 :store data into database
try{
    //fetching data from api to store it in database
    //using '@' show that it does not throw any messages if error found.
$data=@file_get_contents('http://api.openweathermap.org/data/2.5/weather?q='.$cityname.'&appid=36723dee49405ad6240a99f55a23ec19&units=metric',true);
if (!$data){
    //throw error
    throw new Exception('City not found');
}
//decoding data fetched from api
$data= json_decode($data,true);
//keeping fetched data from api into variable 
$weatherdescription=$data['weather'][0]['main'];
$weathericon=$data['weather'][0]['icon'];
$temperature=$data['main']['temp'];
$pressure=$data['main']['pressure'];
$humidity=$data['main']['humidity'];
$visibility=$data['visibility'];
$windspeed=$data['wind']['speed'];
$winddegree=$data['wind']['deg'];
$timestamp=$data['dt'];
$countrty=$data['sys']['country'];
$timezone=$data['timezone'];
$cityname=$data['name'];

//to check if data is present or not in the database
$sql_check_timestamp="SELECT * FROM current_data WHERE time_stamp='".$timestamp."';";
$sql_check_city="SELECT * FROM current_data WHERE city='".$cityname."';";
if(($conn->query($sql_check_timestamp)->num_rows >0) && ($conn->query($sql_check_city)->num_rows >0)){
    //if data is already in the database then it will not store the data in database
    //echo "the data is already present in the database so now it will not load again.<br>";
}
else{
    //if the data not found in database then data stored in above variables will be stored in database using sql command
    //and the old data will be deleted in current_data table
    $conn->query("DELETE FROM current_data WHERE city='".$cityname."';");
    $sql="INSERT INTO current_data VALUES('".$weatherdescription."','".$weathericon."',
    '".$temperature."','".$pressure."','".$humidity."','".$visibility."',
    '".$windspeed."','".$winddegree."',".$timestamp.",'".$countrty."',".$timezone.",
    '".$cityname."');";
if($conn->query($sql)==True){
//echo"data inserted successfully<br>";
}
else{
//echo"data insert failed<br>";
}
}
//keeping the weather data in past_weather_data table
//to check if data is present or not in the database
$sql_check_timestamp="SELECT * FROM past_weather_data WHERE time_stamp='".$timestamp."';";
$sql_check_city="SELECT * FROM past_weather_data WHERE city='".$cityname."';";
if(($conn->query($sql_check_timestamp)->num_rows >0) && ($conn->query($sql_check_city)->num_rows >0)){
    //echo "the data is already present in the database so now it will not load again into database.<br>";
}
else{
    
    $result=$conn->query("SELECT time_stamp FROM past_weather_data WHERE city='".$cityname."' ORDER BY time_stamp DESC LIMIT 1;");
    if($result->num_rows==0){
        /*here we will select data from past_weather_data table according to city entered, and it will check if the data is present 
        or not in database as the number of row is 0 then it indicates there is no data of that following city so it keep the new searched 
        data into database. */
        $sql="INSERT INTO past_weather_data VALUES('".$weatherdescription."','".$weathericon."',
        '".$temperature."','".$pressure."','".$humidity."','".$visibility."',
        '".$windspeed."','".$winddegree."',".$timestamp.",'".$countrty."',".$timezone.",
        '".$cityname."');";
    if($conn->query($sql)==True){
        //echo"data inserted successfully<br>";
    }
    else{
        //echo"data insert failed<br>";
    }}
    else{
        //if the number of rows is greater than 0 it means there is data data of that following city present in it. 
        $row=$result->fetch_assoc();
        $row_data=$row['time_stamp'];
        $row=(int)$row_data;
        $timestamp=(int)$timestamp;
    /* since the data of that following city is present we will need to check if the time difference between current data
    and past data is more or equall to one day. as one day contains 86400 seconds then the difference in timestamp of current and past
    data must be greateer or equalls to 86400 then only the new data will be stored in it else it will iqnore it.*/
        if(($timestamp-$row_data) >= 86400){
            $sql="INSERT INTO past_weather_data VALUES('".$weatherdescription."','".$weathericon."',
            '".$temperature."','".$pressure."','".$humidity."','".$visibility."',
            '".$windspeed."','".$winddegree."',".$timestamp.",'".$countrty."',".$timezone.",
            '".$cityname."');";
        $conn->query($sql);
    }}}
}
catch(Exception $err) {
    //if error while fetching data from api
    //if finds any error then it will catch and throw
    //echo $err;
}


//part-2: taking the data from database and storing it in array
try{
//displayin the data stored in database according to the city name searched using sql command
$sql="SELECT * FROM current_data Where city LIKE '%$cityname%'";
$result=$conn->query($sql);
//declaring array so that al the data retrived can be stored in single variable
$data=array();
if($result->num_rows > 0){
    //if result is greater then 0 then data found in database and it will be stored in data array variable
    while ($row=$result->fetch_assoc()){
        //each row data one at a time be added to the array
        $data[]=$row;
    } 
}
else{
    //data not found in database
    echo json_encode([]);
}
//now taking the data of entered city from past_weather_data table into array data.
$result=$conn->query("SELECT * FROM past_weather_data WHERE city='".$cityname."' ORDER BY time_stamp DESC;");
if($result->num_rows>0){
    while($row=$result->fetch_assoc()){
        $data[]=$row;
    }
    header('Content-Type:application/json');
    //encoding the data so it can be displayed using php
    $json_data=json_encode($data);
    echo $json_data;
    //closing the database
    $conn->close();
}
else{
    echo"no data found of given city!!!";
}
}
catch(Exception $err){
    //city not found in database
}

/*code by
  Name: Pujan Upadhyay
  Group:L4CS16
  College ID:np03cs4a23028
  University Student Number:2408612
 */
?>
