const resetpass = (name, newPass) => {
    return `<div>
    <div 
      style="
        width: 70%; 
        padding: 6px; 
        border: 1px solid #5E7ED2; 
        background-color: #483D8B; 
        border-radius: 3px; 
        flex-direction: column; 
        box-shadow: 2px 2px 1px #5a606f; 
        padding: 20px 30px;
        text-align: center;
        margin-left: auto;
        margin-right: auto;
      ">
      <h1 style="text-align: center; color: white; margin-top: 0px">Equipe Avalia SBIS - Recuperação de senha</h1>
      <h3 style="color: white; margin: 5px 0px">Esqueceu sua senha, ${name}?</h3>
      <p style="color: white; margin: 5px 0px">Não precisa se preocupar...Nós criamos uma nova senha para você! Não esqueça de altera-lá quando acessar a sua conta.</p>
      <p style="color: white; margin: 5px 0px">NOVA SENHA: <b>${newPass}</b></p>
      <p style="color: white; margin: 60px 0px 5px 0px"> Por favor não responda esse email </p>
      <p style="color: white; margin: 5px 0px">Enviado com ❤ pelo Projeto Avalia SBIS.</p>
    </div>
  </div> ` 
};

module.exports = resetpass;