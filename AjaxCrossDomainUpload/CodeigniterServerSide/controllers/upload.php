<?php

class Upload extends CI_Controller
{
   public function __construct()
   {
      parent::__construct();
      $this->load->model('files_model');
      $this->load->database();
      $this->load->helper('url');
	  $this->user_img_path = realpath(APPPATH . '../images');
   }
 
    public function upload_file()
	{		  
		  $data = array();
		  $data['first_name'] = $_POST['first_name'];
		  $data['last_name'] = $_POST['last_name'];
		  $data['email'] = $_POST['email'];
		  $data['title'] = $_POST['title'];
		  $data['rate'] = '0';	  
		  $file_element_name = 'userfile';
		  
		  $status = "";
		  $msg = "";
		  
		  if (empty($data['first_name'])||empty($data['title'])||empty($data['last_name'])||empty($data['email'])){
			 $status = "error";
			 $msg = "Please enter a the information neccessary";
		  }
		  
		  if($status != "error"){
		  	
		  	    $image_name = $data['title'];
	
				$config = array(
					'allowed_types' => 'jpg|jpeg|gif|png',	
					'upload_path' => $this->user_img_path,
					'max_size' => 1024,
					'file_name'=> $image_name,
					'overwrite'=> true
				);		
				$this->load->library('upload',$config);	
				
				if (!$this->upload->do_upload($file_element_name)){
			        $status = 'error';
			        $msg = $this->upload->display_errors('', '');
			    }else{
					$image_data = $this->upload->data(); //get the upload image infos		
					$config = array(
						'source_image' => $image_data['full_path'],
						'new_image' => $this->user_img_path.'/thumbs',
						'maintain_ratio' => true,
						'width' => 150,
						'height' => 120		
					);
					
					$this->load->library('image_lib',$config);	
					if ( ! $this->image_lib->resize()){
			    		echo $this->image_lib->display_errors();
					}else{
						$this->image_lib->resize();			
					}
					
					//save the image url to database
					$user_img_url = base_url().'images/thumbs/'.$image_data['file_name'];		
					$data['thumbs_url'] = $user_img_url;	
					$file_id = $this->files_model->insert_file($data);
					if($file_id){
			            $status = "success";
			            $msg = "File successfully uploaded";
		         	}else{
			            unlink($data['full_path']);
			            $status = "error";
			            $msg = "Something went wrong when saving the file, please try again.";
			        }

					$status = "success" ;
	        		$msg = "Your image have been uploaded, Thank you for your participation!" ;
						    	
			    }
		  	
				
		  }
		  
		  //JSON-encode and return
		  echo $_POST['jsoncallback']. '('.json_encode(array('status' => $status, 'msg' => $msg)).')';
		  //echo json_encode(array('status' => $status, 'msg' => $msg));
		  //echo "{'status':'".$status."','msg':'".$msg."'}";
	}

    public function files()
    {
       $row = array();
	   $row = $this->files_model->get_files();
	   if ($row){
		    echo $_GET['jsoncallback']. '('.json_encode($row).')';
	   }
	}
	
	public function rating()
	{
	   $data = array();
	   $data['ID'] = $_GET['id'];
	   $data['score'] = $_GET['score'];   
	   $query = $this->files_model->update_rating($data);	 
	   if($query){
	   	 echo $_GET['jsoncallback1']. '('.json_encode('success').')'; 
	   }else{
	   	 echo $_GET['jsoncallback1']. '('.json_encode('failed').')'; 
	   }	    
	}
	
	public function comments(){
	   $data = array();
	   $data['fname'] = $_GET['fname'];
	   $data['lname'] = $_GET['lname'];
	   $data['email'] = $_GET['emailc'];
	   $data['comment'] = $_GET['comment'];
	   $query = $this->files_model->insert_comment($data);
	    if($query){
	   	 echo $_GET['jsoncallback2']. '('.json_encode('success').')'; 
	   }else{
	   	 echo $_GET['jsoncallback2']. '('.json_encode('failed').')'; 
	   }	   
	}
	
	public function get_comments()
    {
       $row = array();
	   $row = $this->files_model->get_comments();
	   if ($row){
		    echo $_GET['jsoncallback3']. '('.json_encode($row).')';
	   }
	}
	
	
	/// for oxygen city event
	public function sendMailForContest()
	{
	    $email = $_GET['SentToEmail'];
		$this->load->library('email');    
        $this->email->set_newline("\r\n");
        $this->email->from($email);
        $this->email->to("wei.huang@cgi.com");
        $this->email->subject('A New Participant for Oxygen City Page');
        $this->email->message('There is a new participant for oxygen city page, email : '.$email);      
        if($this->email->send()){
            echo $_GET['jsoncallback']. '('.json_encode('success').')';                
        }else{            
            echo $_GET['jsoncallback']. '('.json_encode('failed').')';      
       }
	
	}
	 
   
}
