<?php
include_once 'functions.php';

if(isset($_REQUEST))
{
    if(isset($_REQUEST['departmentname']))
    {
        $strDeptName = $_REQUEST['departmentname'];
        
       $getresult = SearchByDepartment($strDeptName);
       
       //print json_encode($getresult);
    }
    else if(isset($_REQUEST['browseby']))
    {
        $strBrowseBy = $_REQUEST['browseby'];
        
        $getresult = BrowseBy($strBrowseBy);                
    }
    else if(isset($_REQUEST['firstlastname']))
    {
        $strFirstLastName = $_REQUEST['firstlastname'];
        
        $getresult = SearchByFirstLast($strFirstLastName);                
    }
    else if(isset($_REQUEST['profileid']))
    {
        $strProfileId = $_REQUEST['profileid'];
        
        $getprofile = getProfileDetails($strProfileId);                        
    }
}

if(count($getresult)>0)
{    
?>
<table class="myfac_serresult" cellpadding="0" cellspacing="0">
    <tr class="title">
            <td>Last Name, First Name</td>
            <td>Phone</td>
            <td>Email</td>
            <td>Title</td>
            <td>Department / Office</td>
    </tr>
    <?php
    
    $boolFlag = TRUE;
    
    foreach ($getresult as $res)
    {        
        $tr_css = '';
        if($boolFlag)
        {
            $boolFlag = FALSE;
            $tr_css = "item";
        }
        else
        {
            $boolFlag = TRUE;
            $tr_css = "item2";
        }
    ?>
    <tr class="<?=$tr_css?>">    
        <td><a href="javascript:getProfile(<?=$res['ID']?>)"><?=$res['LastName']?>&nbsp;<?=$res['FirstName']?></a>&#160;</td>
        <td><?=$res['Phone']?>&#160;</td>
        <td><a class="email" href="mailto:<?=$res['Email']?>"><?=$res['Email']?></a>&#160;</td>
        <td><?=$res['Title']?>&#160;</td>
        <td><?=$res['Department']?>&#160;</td>
    </tr>
    <?php                
    }
    ?>
</table>

<?php
}
else if(isset($strProfileId))
{    
    if(count($getprofile)>0)
    {
?>
        <div class="margin_finderResult" style="" >
            <div class="content_profile">
                <div class="detail_profile">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td valign="top">
                            <p class="title_name_1"><?=$getprofile['FirstName']?>&nbsp;<?=$getprofile['LastName']?></p>
                            <ul>
                                <li><p class="title_name"><?=(!empty($getprofile['Title']))?$getprofile['Title']:''?></p></li>
                                <li><strong>Department :</strong>&nbsp;<?=(!empty($getprofile['Department']))?$getprofile['Department']:''?></li>
                                <li><strong>Phone :</strong>&nbsp;<?=(!empty($getprofile['Phone']))?$getprofile['Phone']:''?></li>
                                <li><strong>Email :</strong>&nbsp;<a class="email" href="mailto:<?=(!empty($getprofile['Email']))?$getprofile['Email']:''?>"><?=(!empty($getprofile['Email']))?$getprofile['Email']:''?></a></li>                
                            </ul>
                        </td>
                    </tr>
                    </table>
                    <div class="gobacktosearch"><a href="javascript:backtosearch();">Back to Search Results</a></div>
                </div>
            </div>
        </div>
<?php              
    }
}
else
{
    echo "No Results found. Please try again.";
}

?>