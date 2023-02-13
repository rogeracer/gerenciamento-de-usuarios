class UserController{

	constructor(formId,formIdUpdate,tableId){

		this.formEl = document.getElementById(formId);
		this.formUpdateEl = document.getElementById(formIdUpdate);
		this.tableEL = document.getElementById(tableId);
		this.onSubmit();
		this.onEdit();
		this.selectAll();
	}

	addLine(dataUser){

		let tr = this.getTr(dataUser);

		this.tableEL.append(tr);

		this.updateCount();
	}

	getTr(dataUser, tr = null){

		if(tr === null)
			tr = document.createElement("tr");

		tr.dataset.user = JSON.stringify(dataUser);

		tr.innerHTML = `
                    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${dataUser.name}</td>
                    <td>${dataUser.email}</td>
                    <td>${(dataUser.admin)?"Sim":"Não"}</td>
                    <td>${Utils.dateFormat(dataUser.register)}</td>
                    <td>
                      <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
                      <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete">Excluir</button>
                    </td>
    `;

    this.addEvents(tr);

    return tr;

	}


	getValues(formEl){

		const user = {};
		let formValid = true;

		[...formEl.elements].forEach(field =>{

			if(["name","email", "password"].includes(field.name) && !field.value){
				formValid = false;
				field.parentElement.classList.add("has-error");
			}

			if(field.name == "gender"){
			
				if(field.checked){
			
					user[field.name] = field.value;
				};
			}

			else if(field.name == "admin"){
			
					user[field.name] = field.checked;

			}else{
			
				user[field.name] = field.value;
			}

		});

		if(!formValid){
			return false
		}

		return new User(
			user.name,
			user.gender,
			user.birth,
			user.country,
			user.email,
			user.password,
			user.photo,
			user.admin
		)
	}

	selectAll(){

		let users = User.getUsersStorage();

		users.forEach(dataUser =>{

			let user = new User();
			user.loadFromJSON(dataUser)
			this.addLine(user);
		
		});

	}

	getPhoto(formEl){

		return new Promise((res,rej)=> {

			let fileReader = new FileReader();
			let [elements,] = [...formEl.elements].filter(item => item.name == "photo"?item:false );
			let [file,] = elements.files;

			
			fileReader.onload = () => res(fileReader.result);

			fileReader.onerror = (e) => rej(e);

			file?fileReader.readAsDataURL(file):res("./dist/img/boxed-bg.jpg");

		});

	}

	onEdit(){

		document.querySelector(".btn-cancel").addEventListener("click", () =>{
			this.showPanelCreate()
		});

		this.formUpdateEl.addEventListener("submit", e =>{

			e.preventDefault();

			let btn = this.formUpdateEl.querySelector("[type = submit]");

			btn.disabled = true;
			
			let values = this.getValues(this.formUpdateEl);
			let index = this.formUpdateEl.dataset.trIndex;
			let tr = this.tableEL.rows[index];
			let userOld = JSON.parse(tr.dataset.user);
			let result = Object.assign({},userOld,values);
			
			
	    this.getPhoto(this.formUpdateEl).then( content =>{
				
				if(!values.photo){
					result._photo = userOld._photo
				}else{
					result._photo = content
				};

				let user = new User();

				user.loadFromJSON(result);

				user.save();

				this.getTr(user,tr)

	    	this.updateCount();
				this.formUpdateEl.reset();
				btn.disabled = false;
				this.showPanelCreate();

			}).catch(e => console.log(e))

		});
	}

	addEvents(tr){

		tr.querySelector(".btn-delete").addEventListener("click", (e) =>{

				if(confirm("Tem certeza que deseja excluir?")){
					let user = new User();
					user.loadFromJSON(JSON.parse(tr.dataset.user));
					user.remove();
					tr.remove();
					this.updateCount();
				}
		});

		tr.querySelector(".btn-edit").addEventListener("click", (e)=>{
				
				let json = JSON.parse(tr.dataset.user);
				
				this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

				for(let name in json){

					let field = this.formUpdateEl.querySelector(`[name=${name.replace("_","")}]`);

					if(field){
						switch(field.type){

							case 'file':
								continue;
								break

							case 'radio':
								field = this.formUpdateEl.querySelector(`[name=${name.replace("_","")}][value=${json[name]}]`);
								field.checked = true;
								break

							case 'checkbox':
								field.checked = json[name];
								break
							
							default:
								field.value = json[name];
						};
					}
				};

				this.formUpdateEl.querySelector(".photo").src = json._photo;
				this.showPanelUpdate();
			})
		}

	showPanelCreate(){
		
		document.querySelector("#box-user-create").style.display = "block";
		document.querySelector("#box-user-update").style.display = "none";

	}

	showPanelUpdate(){

		document.querySelector("#box-user-create").style.display = "none";
		document.querySelector("#box-user-update").style.display = "block";
	
	}

	onSubmit(){

		this.formEl.addEventListener("submit", e =>{
			
			e.preventDefault();

			let btn = this.formEl.querySelector("[type = submit]");

			btn.disabled = true;
			
			let values = this.getValues(this.formEl);

			if(!values){
				btn.disabled = false;
				return
			};
			
			this.getPhoto(this.formEl).then( content =>{
				
				values.photo = content;
				values.save();
				this.addLine(values);
				this.formEl.reset();
				btn.disabled = false;

			}).catch(e => console.log(e))
			
		});
	}

	updateCount(){

		let numbersUsers = 0;
		let numbersAdmin = 0;

		[...this.tableEL.children].forEach(tr => {

			numbersUsers++;

			let user = JSON.parse(tr.dataset["user"]);

			if(user._admin){
				numbersAdmin++;
			};

			document.getElementById("numbers-users").innerHTML = numbersUsers;
			document.getElementById("numbers-users-admin").innerHTML = numbersAdmin;

		});
	}

}