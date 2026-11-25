# Documentação
Documentação básica do sistema de agendamento de consultas para a Clínica dentária XPTO
## Requisitos funcionais do Sistemas

|ID|Requisito|Descrição|
|-|-|-|
|[RF001]|Login|Login com autenticação JWT com tokem expirando em 30 minutos|
|[RF001.1]|Login|Campos **login** e **senha** (senha criptografada com pacote bcrypt do Node.js)|
|[RF002]|Tela Principal|Tepa principal acessada somente se o login obtiver sucesso<br>Exibindo o nome do usuário, um menu com as opções [Home, paciente, dentista e Sair] e fazendo o gerenciamento de Agendamentos no corpo desta página|
|[RF003]|Gerenciamento de pacientes|Modal exibindo a lista de pacientes editável e permitindo excluir, campo de busca/filtro, formulário para adicionar novo paciente e CPF criptografado no banco de dados|
|[RF004]|Gerenciamento de dentistas|Modal exibindo a lista de dentistas, formulário para adicionar novo dentista relacionado a um paciente|
|[RF005]|Agendamento|Na tela principal deve conter a listagem dos agendamentos cadastrados ordenado por dia de agendamento, trazendo todos os dados do paciente e do dentista, permitindo atualizar a data do agendamento|

## Requisitos de infraestrutura 
- SGBD Utilizado: MySQL (MariaDB) 
    - Versão: 10.11.16-MariaDB MariaDB Server 
- Linguagem de Programação: Node.js JavaScript 
    - Versão: v26.13.1

## MER DER Conceitual

```mermaid
flowchart LR
    Usuario[Usuário]
    usuario_id((<u>id</u>)) --- Usuario
    usuario_nome((nome)) --- Usuario
    usuario_login((login)) --- Usuario
    usuario_senha((senha)) --- Usuario
    
    paciente[paciente]
    paciente_id((<u>id</u>)) --- paciente
    paciente_nome((nome)) --- paciente
    paciente_cpf((cpf)) --- paciente

    dentista[dentista]
    dentista_id((<u>id</u>)) --- dentista
    dentista_nome((nome)) --- dentista
    dentista_cro((cro)) --- dentista
    dentista_especialidade((especialidade)) --- dentista
    
    paciente ---|1| Possui{Possui} ---|N| Agendamento
    Usuario ---|1| Registra{Registra} ---|N| Agendamento
    dentista ---|1| Atende{Atende} ---|N| Agendamento

    Agendamento[Agendamento]
    agendamento_id((<u>id</u>)) --- Agendamento
    agendamento_data((data)) --- Agendamento
    agendamento_usuario_id((<i>usuarioId</i>)) --- Agendamento
    agendamento_paciente_id((<i>pacienteId</i>)) --- Agendamento
    agendamento_dentista_id((<i>dentistaId</i>)) --- Agendamento

```

## MER DER Conceitual - versão Draw.io
![DER](./docs/mer_der_conceitual.png)