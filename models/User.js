class User{

	constructor(name,gender,birth,country,email,password,photo,admin){
		
		this._name = name;
		this._gender = gender;
		this._birth = birth;
		this._country = country;
		this._email = email;
		this._password = password;
		this._photo = photo;
		this._admin = admin;
		this._register = new Date();
		this._id;
	}

	get id(){
		return this._id;
	}

	get name(){
		return this._name;
	}

	get gender(){
		return this._gender;
	}

	get birth(){
		return this._birth;
	}

	get country(){
		return this._country;
	}

	get email(){
		return this._email;
	}

	get password(){
		return this._password;
	}

	get photo(){
		return this._photo;
	}

	set photo(value){
		this._photo = value;
	}

	get admin(){
		return this._admin;
	}

	get register(){
		return this._register;
	}

	loadFromJSON(json){

		for(let name in json){

			if(name == "_register"){
				this[name] = new Date(json[name]);
				continue
			}

			this[name] = json[name]

		}

	}

	getNewId(){

		let userId = localStorage.getItem("userId");
		if(!userId > 0){
			userId = 0
		};

		userId++;
		localStorage.setItem("userId", userId);
		return userId

	}

	static getUsersStorage(){

		let users = [];

		if(localStorage.getItem("users")){
			users = JSON.parse(localStorage.getItem("users"))
		};

		return users
	}

	save(){

		let users = User.getUsersStorage();

		if(this.id > 0){

			users.map(u => u._id == this.id ? Object.assign(u,this) : u);

		}else{

			this._id = this.getNewId();

			users.push(this);
		};

		localStorage.setItem("users", JSON.stringify(users));
	}

	remove(){

		let users = User.getUsersStorage();

		let newUsers = users.filter( u => u._id != this._id);

		localStorage.setItem("users", JSON.stringify(newUsers));
	}
}