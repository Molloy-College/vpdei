<!--Section 1 - Body Copy and SideBar Section-->
<section id="body-copy" class="mc-row full-width-section standard-section first-section" style="background-color: #ECEFF1;">
	<div class="row">
		<div class="col-md-6 col-md-offset-4">
			<style>
			.login_body input[type=text], .login_body input[type=password]{
				border: 0;
				outline: 0;
				background: transparent;
				border-bottom: 1px solid #ccc;
				transition: border-color 0.25s ease-in-out,line-height 0.25s ease-in-out;
				-webkit-transition: border-color 0.25s ease-in-out,line-height 0.25s ease-in-out;
				-moz-transition: border-color 0.25s ease-in-out,line-height 0.25s ease-in-out;
				display: block;
				margin-bottom: 20px;
				width: 100%;
				line-height: 37.5px;
			}
				.login_wrapper{
					margin-top: 50px;
					max-width: 380px;
				}
				.login_header{
					background-color: #981E32;
					padding: 10px;
					color: #fff;
					text-align: center;
				}
				.login_header h4{
					font-size: 16px;
					font-weight: bold;
				}
				.login_body{
					padding: 20px 10px;
					background-color: #fff;
					box-shadow: 0px 2px 7px 0px #ccc;
					border-radius: 4px;
				}
				.btn{
					background-color: #981E32;
					color: #fff;
				}
			</style>
			<div class="login_wrapper">
				<div class="login_header">
					<h4>Account Login</h4>
				</div>
				<div class="login_body">
					<p>Login using your <strong>Molloy username</strong> and password. <br/>(<strong>Do NOT include @molloy.edu </strong> after your username.)</p>
					<form action="vpdei/index.php" method="post">
						<?php
							if($loginErrorCredentials == true) {
								echo "<p style='color:red'>Invalid Username or Password</p>";
							}
						?>
						<p>
						<label style="display:none;">Username:</label>
						<input type="text" name="username" value="" placeholder="Username" />
						</p>
						<p>
						<label for="" style="display:none;">Password:&nbsp;</label>
						<input type="password" name="password" value="" placeholder="Password" />
						</p>
						<input type="hidden" name="logged_in" value="1" />
						<p style="text-align: center;">
							<input type="submit" class="btn btn-default" name="submit" value="Login" />
						</p>
					</form>
				</div>
				<div class="login_footer">
					
				</div>
			</div>			
		</div>					
	</div>					
</section>	
<!--//Section 1 - Body Copy and SideBar Section-->