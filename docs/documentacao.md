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

<details><summary><h2>MER DER Conceitual</h2></summary>

```mermaid
flowchart LR

    %% Entidades e Atributos
    Usuario[Usuário]
    Usuario --- c1(( )) ~~~ t1[id]:::pk
    Usuario --- c2(( )) ~~~ t2[nome]
    Usuario --- c3(( )) ~~~ t3[login]
    Usuario --- c4(( )) ~~~ t4[senha]
    
    Paciente[paciente]
    Paciente --- c5(( )) ~~~ t5[id]:::pk
    Paciente --- c6(( )) ~~~ t6[nome]
    Paciente --- c7(( )) ~~~ t7[cpf]

    Dentista[dentista]
    Dentista --- c8(( )) ~~~ t8[id]:::pk
    Dentista --- c9(( )) ~~~ t9[nome]
    Dentista --- c10(( )) ~~~ t10[cro]
    Dentista --- c11(( )) ~~~ t11[especialidade]

    Agendamento[Agendamento]
    Agendamento --- c12(( )) ~~~ t12[id]:::pk
    Agendamento --- c13(( )) ~~~ t13[data]
    Agendamento --- c14(( )) ~~~ t14[usuarioId]
    Agendamento --- c15(( )) ~~~ t15[pacienteId]
    Agendamento --- c16(( )) ~~~ t16[dentistaId]
    
    %% Relacionamentos
    Paciente ---|1| Possui{Possui} ---|N| Agendamento
    Usuario ---|1| Registra{Registra} ---|N| Agendamento
    Dentista ---|1| Atende{Atende} ---|N| Agendamento

    %% Estilização
    classDef pk font-weight:bold,text-decoration:underline;
    classDef fk font-style:italic,text-decoration:underline dotted;
    classDef entidades fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    classDef relacionamentos fill:#e1f5fe,stroke:#01579b,stroke-width:1px;
    classDef atributos fill:none,stroke:none;
    class t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11,t12,t13,t14,t15,t16 atributos
    class t14,t15,t16 fk
    class Usuario,Paciente,Dentista,Agendamento entidades
    class Possui,Registra,Atende relacionamentos
```

</details>

## MER DER Conceitual - versão Draw.io
![DER](./mer_der_conceitual.png)

## UML - Diagrama de Atividades
Diagrama de atividades com os passos para **agendar uma consulta** que seria a atividade principal do sistema.
```mermaid
flowchart TD
    subgraph t1[Tela de Login]
        Inicio([Início]) --> Validar[Validar login e senha]
        Validar --> Decisao{Credenciais corretas?}
        Decisao -- Não --> AcessoNegado[Login ou senha inválidos.]
        AcessoNegado --> Fim([Fim])
        Decisao -- Sim --> Credenciais[Armazena o token e dados do usuário]
        Credenciais --> Entrar[Vai para a Home]
    end

    subgraph t2[Home Concultas]
        Entrar --> InicioHome([Início]) --> ValidarToken{Token ativo<br>e Armazenado?}
        ValidarToken -- Sim --> NomeUsuario[Exibe nome do usuário]:::atividades
        ValidarToken -- Sim --> ListarAgendamentos[Listar os agendamentos por data]:::atividades
        ValidarToken -- Sim --> NovoAgendamento[Exibe formulário para novo agendamento]:::atividades
        ListarAgendamentos --> EditarAgendamento[Funcionalidade de atualizar data]:::atividades
        ValidarToken -- Não --> Sair[Exclui crenenciais locais e volta para a página de Login]:::atividades
        NomeUsuario --> Menu[Menu com opções: Pacientes, Dentistas e Sair]:::atividades
        NovoAgendamento --> Preencher[Preencher formulários escolhendo Paciente, Dentista e Data]:::atividades
        Preencher --> Decisao2{Paciente e<br>dentista<br>já cadastrados}
        Decisao2 -- sim --> Enviar[Envia os dados para o Banco de dados]:::atividades
        Decisao2 -- não --> Menu
        Enviar --> AtualizaLista[Lista de agendamentos é atualizada com a adição do novo]:::atividades
        AtualizaLista --> FimHome([Fim])
        Sair --> Inicio
    end

    classDef inicioFim fill:#ffcccc,stroke:#eba0ac,stroke-width:2px,color:#11111b,font-weight:bold;
    classDef atividades fill:#ffffff,stroke:#666633,stroke-width:2px,color:#11111b;
    classDef decisao fill:#ffddcc,stroke:#fab387,stroke-width:2px,color:#11111b;
    classDef quadros fill:#ffffdd, stroke:#94e2d5,stroke-width:2px,color:#000000;

    class Inicio,Fim,InicioHome,FimHome inicioFim;
    class Validar,AcessoNegado,Credenciais,Entrar atividades;
    class Decisao,ValidarToken,Decisao2 decisao;
    class t1,t2 quadros;


```