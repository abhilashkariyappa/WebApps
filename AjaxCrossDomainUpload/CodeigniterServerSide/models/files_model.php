<?php

class Files_Model extends CI_Model {
 
   public function insert_file($data)
   {
      	$this->db->insert('image_upload', $data);
      	return $this->db->insert_id();
   }
   
   public function get_files()
   {
   		 return $this->db->select()
         ->from('image_upload')
         ->order_by("rate", "desc")
         ->get()
         ->result();
   }
   
   public function update_rating($data){
   	   $query = $this->db->where('ID',$data['ID'])->limit(1)->get('image_upload');
	   
	   $update_data = array('rate' => $data['score']);	
	   
	   if($query->num_rows() != 0){
			$this->db->where('ID',$data['ID']);				
			$this->db->update('image_upload', $update_data); 
	   }
	   return true; 
   }
   
   public function insert_comment($data){
   	   $insert_data = array(
	      'first_name' => $data['fname'],
	      'last_name' => $data['lname'],
	      'email' => $data['email'],
	      'comment' => $data['comment']	   
	   );
	   $query = $this->db->insert('comments',$insert_data);
	   if($query){
	   	 return true;
	   }else{
	   	 return false;
	   }
   }
   
   public function get_comments()
   {	 
		 return $this->db->select('first_name,last_name,comment')
         ->from('comments')
		 ->order_by("ID", "desc")
         ->get()
         ->result();
		 
   }

}