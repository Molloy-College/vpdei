<?
class DBConnection
{
	protected static $_DatabaseConnection = null;
        protected static $_Result = null;
        protected static $_Executed;        
	
	/**
	 * @return DBConnection
	 */
	public static function GetDatabaseConnection()
	{
		if (!isset(self::$_DatabaseConnection))
		{						
			$connectionString = "Driver={SQL Server Native Client 10.0};Server=192.168.200.65;Database=Ingeniux;";
                        
			if (count($connectionString) != 1)
			{
				throw new Exception('ConnectionString not properly configured. Check your configuration file.');
			}
		
			
			self::$_DatabaseConnection = DBConnection::Connect($connectionString);
		}
		
		return self::$_DatabaseConnection;
	}	
        
        /**
	 * @return Connection
	 */
	public static function Connect($connectionString)
	{
            $connection = odbc_connect($connectionString,'ingeniux','ingmolloy123') or die('ODBC Error:: '.odbc_error().' :: '.odbc_errormsg().' :: '.$connectionString);
            //$connection = odbc_connect($connectionString,'sa','Apples2go') or die('ODBC Error:: '.odbc_error().' :: '.odbc_errormsg().' :: '.$connectionString);
            
            if (!$connection)
            {
                exit("Connection Failed: " . $connection);    
            }
            
            return $connection;
            
        }
        
        
        public static function Execute($query)
	{
            if (!self::$_Executed)
            {
                    self::$_Executed = true;
            }

            self::$_Result = odbc_exec(self::$_DatabaseConnection,$query);
            
            if(!self::$_Result)
            {
                exit("Error in SQL");                
            }
            else
            {
                return self::$_Result;
            }
            
        }
        
        public static function SelectRowArray()
	{				
		$rows = array();

		while (odbc_num_rows(self::$_Result))
		{
			$rows[] = odbc_fetch_array(self::$_Result);
		}
		
                odbc_close(self::$_DatabaseConnection);
                
                //remove an extra blank row
                array_pop($rows);
                
		return $rows;                
	}        
        
        public static function SelectRow()
	{		
		
		$row = odbc_fetch_array(self::$_Result);
                
                odbc_close(self::$_DatabaseConnection);
                
                return $row;
	}

}
?>