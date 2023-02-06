class UserController{

	constructor(formId,tableId){

		this.formEl = document.getElementById(formId);
		this.tableEL = document.getElementById(tableId);
		this.onSubmit();
	}

	addLine(dataUser){

		this.tableEL.innerHTML += `
			<tr data-user=${JSON.stringify(dataUser)}>
                    <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                    <td>${dataUser.name}</td>
                    <td>${dataUser.email}</td>
                    <td>${(dataUser.admin)?"Sim":"Não"}</td>
                    <td>${Utils.dateFormat(dataUser.register)}</td>
                    <td>
                      <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                      <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                    </td>
                  </tr>
		`;

		this.updateCount();
	}

	getValues(){

		const user = {};
		let formValid = true;

		[...this.formEl.elements].forEach(field =>{

			if(["name","email", "password"].includes(field.name) && !field.value){
				formValid = false;
				field.parentElement.classList.add("has-error");
			}

			if(field.name == "gender"){
			
				if(field.checked){
			
					user[field.name]= field.value;
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

	getPhoto(){

		return new Promise((res,rej)=> {

			let fileReader = new FileReader();
			let [elements,] = [...this.formEl.elements].filter(item => item.name == "photo"?item:false );
			let [file,] = elements.files;

			
			fileReader.onload = () => res(fileReader.result);

			fileReader.onerror = (e) => rej(e);

			file?fileReader.readAsDataURL(file):res("./dist/img/boxed-bg.jpg");

		});

	}

	onSubmit(){

		this.formEl.addEventListener("submit", e =>{
			
			e.preventDefault();

			let btn = this.formEl.querySelector("[type = submit]");

			btn.disabled = true;
			
			let values = this.getValues();

			if(!values){
				btn.disabled = false;
				return
			};
			
			this.getPhoto().then( content =>{
				
				values.photo = content;
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

			let user = JSON.parse(tr.dataset.user);

			if(user._admin){
				numbersAdmin++;
			};

			document.getElementById("numbers-users").innerHTML = numbersUsers;
			document.getElementById("numbers-users-admin").innerHTML = numbersAdmin;

		});
	}

}