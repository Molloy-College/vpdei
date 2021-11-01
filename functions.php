<?php
include_once 'database.php';

function GetNormalizeDeptName($department)
{
    if(!empty($department))
    {
        $deptname = str_replace("&", "and", $department);
        $deptname = trim(strtolower(str_replace(" ", "", $deptname)));
        
        return $deptname;        
    }
    else {
        return '';
    }
         
        
}


function ListDepartment()
{
    $db = DBConnection::GetDatabaseConnection();

    $query = "SELECT DISTINCT [Department] AS [Department] FROM [dbo].[MOC_LDAP_MASTER] WHERE [Department] != '' ORDER BY [Department] ASC";
    $stmt = DBConnection::Execute($query);

    //To get a LIST of ROWS
    if ($rows = DBConnection::SelectRowArray())
    {
        return $rows;
    }
    
    return array();
}

function SearchByDepartment($departmentname)
{
    $db = DBConnection::GetDatabaseConnection();

    $query = "SELECT [REC_NUM] AS [ID],[FirstName] AS [FirstName],[MiddleInitial] AS [MiddleInitial],[LastName] AS [LastName],[Extension] AS [Phone],[EMail] AS [Email],[Title] As [Title],[RoomNumber] As[RoomNumber],[Department] AS [Department] FROM [dbo].[MOC_LDAP_MASTER] WHERE [Department] = '".$departmentname."' ORDER BY [LastName] ASC";
    $stmt = DBConnection::Execute($query);

    //To get a LIST of ROWS
    if ($rows = DBConnection::SelectRowArray())
    {
        return $rows;
    }
    
    return array();
}

function BrowseBy($startletter)
{
    $db = DBConnection::GetDatabaseConnection();

    $query = "SELECT [REC_NUM] AS [ID],[FirstName] AS [FirstName],[MiddleInitial] AS [MiddleInitial],[LastName] AS [LastName],[Extension] AS [Phone],[EMail] AS [Email],[Title] As [Title],[RoomNumber] As[RoomNumber],[Department] AS [Department] FROM [dbo].[MOC_LDAP_MASTER] WHERE [LastName] LIKE '".$startletter."%' ORDER BY [LastName] ASC";
    $stmt = DBConnection::Execute($query);

    //To get a LIST of ROWS
    if ($rows = DBConnection::SelectRowArray())
    {
        return $rows;
    }
    
    return array();
}

function SearchByFirstLast($firstlastname)
{
    $db = DBConnection::GetDatabaseConnection();

    $query = "SELECT [REC_NUM] AS [ID],[FirstName] AS [FirstName],[MiddleInitial] AS [MiddleInitial],[LastName] AS [LastName],[Extension] AS [Phone],[EMail] AS [Email],[Title] As [Title],[RoomNumber] As[RoomNumber],[Department] AS [Department] FROM [dbo].[MOC_LDAP_MASTER] WHERE [LastName] LIKE '%".$firstlastname."%' OR [FirstName] LIKE '%".$firstlastname."%' ORDER BY [LastName] ASC";
    $stmt = DBConnection::Execute($query);

    //To get a LIST of ROWS
    if ($rows = DBConnection::SelectRowArray())
    {
        return $rows;
    }
    
    return array();
}

function getProfileDetails($profileid)
{
    $db = DBConnection::GetDatabaseConnection();

    $query = "SELECT [REC_NUM] AS [ID],[FirstName] AS [FirstName],[MiddleInitial] AS [MiddleInitial],[LastName] AS [LastName],[Extension] AS [Phone],[EMail] AS [Email],[Title] As [Title],[RoomNumber] As[RoomNumber],[Department] AS [Department] FROM [dbo].[MOC_LDAP_MASTER] WHERE [REC_NUM] = ".$profileid;
    $stmt = DBConnection::Execute($query);

    //To get a LIST of ROWS
    if ($rows = DBConnection::SelectRow())
    {
        return $rows;
    }
    
    return array();
}
?>
  

          
          