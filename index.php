<!-- CONTAINS LOGIN : bodycopy2.php -->

<?php
// phpinfo();
session_start();
$loginErrorCredentials = false;

//include_once 'functions.php';
if(isset($_POST['username']) && isset($_POST['password']) && ($_POST['username'] != "") && ($_POST['password'] != "")){ // && ($_POST['username'] != "") && ($_POST['password'] != "")
	// $config = parse_ini_file('../private/config.ini');

    $adServer = 'ldap://172.17.2.100';
		
    $ldap = ldap_connect($adServer);
    $username = $_POST['username'];
    $password = $_POST['password'];
		
    $ldaprdn = 'molloy' . "\\" . $username;
		

    ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);

    $bind = @ldap_bind($ldap, $ldaprdn, $password);
		

    if ($bind) {
			@ldap_close($ldap);
			$_SESSION['username'] = $username;
			header('Location: https://blogs.molloy.edu/vpdei/search.php'); 
      // @ldap_close($ldap);
    } else {
			echo "error";
    	@ldap_close($ldap);
    	$loginErrorCredentials = true;
    }
}

?>

<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=10,IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, user-scalable=0, initial-scale=1.0">
    
	<meta property="og:title" content="Vice President for Academic Affairs - Search" />	
	<meta property="og:description" content="Employee-only page for information regarding the new Vice President for Academic Affairs."/>
	
    <meta name="description" content="Employee-only page for information regarding the new Vice President for Academic Affairs." />
    <meta name="keywords" content="" />

	<title>Molloy College: VPDEI Search</title>    	

    <base href="https://<?=$_SERVER['HTTP_HOST']?>/"/>
	
	<!--[if (lt IE 10)]>
	<script type="text/javascript">
    // Fix for IE ignoring relative base tags.
    (function() {
        var baseTag = document.getElementsByTagName('base')[0];
        baseTag.href = baseTag.href;
    })();
	</script>
	<![endif]-->
	
    <link rel="shortcut icon" type="image/x-icon" href="https://www.molloy.edu/prebuilt/images/structure/favicon.ico" />
	
	<link href='https://fonts.googleapis.com/css?family=Open+Sans:800,700,300,600,400' rel='stylesheet' type='text/css'>

	<link href="https://employees.molloy.edu/css/bootstrap.min.css" rel="stylesheet">        
	<link href="https://employees.molloy.edu/css/font-awesome.min.css" rel="stylesheet" />	
	
	<link rel="stylesheet" href="https://employees.molloy.edu/css/components.css" type="text/css" media="all"/>	
	<link rel="stylesheet" href="https://employees.molloy.edu/css/style.css" type="text/css" media="all"/>	
    <link rel="stylesheet" href="https://employees.molloy.edu/css/responsive.css" type="text/css" media="all"/>    
	<link rel="stylesheet" href="https://employees.molloy.edu/css/emp.css" type="text/css" media="all"/>	
	
	<!--[if lt IE 9]>
		<link href="https://www.molloy.edu/prebuilt/css/font-awesome/font-awesome-ie7.min.css" rel="stylesheet" />	
		<link rel='stylesheet' id='molloy-ie8-css'  href='https://www.molloy.edu/prebuilt/css/ie8.css?ver=3.8' type='text/css' media='all' />
	<![endif]-->
	
	<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
	
    
    
</head>
<body id="" class="loginPage page" style="background-color: #ECEFF1" data-pagetype="LoginPage" data-components="" data-animated="fadeIn" data-bg-header="true" data-ext-responsive="false" data-header-resize="1" data-header-color="light" data-transparent-header="false" data-smooth-scrolling="1" data-responsive="1" >
    <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
    <![endif]-->
	<noscript><div id="noscript-wrapper">Molloy College needs JavaScript enabled in your browser.</div></noscript>    
	<div id="page" class="@page_class">
		<?php include 'login_header.php';?>
		<?php include 'pageheader.php';?>
		<div class="container-wrap" style="padding-top: 98px;">			
			<div class="main-content container">				
				<?php include 'bodycopy2.php';?>
			</div>				
		</div>					
		<?php //include 'footer_new.php';?>
	</div>	
    
	<!-- Placed at the end of the document so the pages load faster -->
	<script type="text/javascript" src="https://employees.molloy.edu/js/jquery-1.9.1.min.js"></script>
    <script src="https://employees.molloy.edu/js/bootstrap.min.js"></script>
	<script src="https://employees.molloy.edu/js/jquery-ui.min.js" type="text/javascript"></script>	
    <script type="text/javascript" src="https://employees.molloy.edu/js/modernizr.js"></script> 
	
	<script type="text/javascript" src="https://employees.molloy.edu/js/components.js"></script>		
	<script type="text/javascript" src="https://employees.molloy.edu/js/main.js"></script>   
	
    <script src="https://employees.molloy.edu/js/main_emp.js"></script>
</body>
</html>