## Situação desafiadora

### Contextualização
A **clínica dentaria XPTO** enfrenta dificuldades em sua rotina de atendimentos devido à ausência de um sistema informatizado. O controle manual dos agendamentos e dos registros de pacientes e dentistas tem ocasionado perda de consultas, duplicidade de informações e falhas no armazenamento de dados. Além disso, a ausência de mecanismos adequados de proteção dos dados pessoais dos pacientes, como o CPF, pode comprometer a segurança dessas informações e resultar no descumprimento das disposições da Lei Geral de Proteção de Dados (LGPD).
<br>Para resolver essa situação, o gestor da clínica **contratou sua equipe** para desenvolver uma solução de software que organize o processo de agendamento e gestão de informações. Durante a reunião inicial, o gestor destacou a importância da autenticação dos usuários (Funcionários de atendimento: recepcionistas) **com tempo de expiração**, da proteção dos dados pessoais armazenados e da documentação técnica do sistema, incluindo requisitos funcionais e geração do diagrama entidade relacionamento, a fim de garantir a manutenção futura do sistema.
<br> Após a reunião com o gestor da clínica, foram definidos algumas regras de negócio:
- No script do banco de dados devem existir pelo menos três registros para todas as tabelas criadas, respeitando os tipos de dados, chaves primárias e estrangeiras.
- Na funcionalidade de **login**, fazer validação de login e senha da(o) recepcionista que agenda as consultas em contato com os clientes por telefone ou whatsapp e em caso de falha na autenticação não permitir exebir mais informações do sistema.
- O CPF dos pacientes deve ser armazenado de forma criptografada no banco de dados, além da senha da(o) usuária(o)/funcionária(o).
- A **funcionalidade principal** do sistema deve exibir: nome do usuário logado e uma forma de acessar os demais recursos, assim como uma maneira de sair do sistema.
- A funcionalidade de **paciente** deve conter: um recurso de busca para que a(o) usuária(o) possa inserir o
termo, o qual, após inserção e confirmação, deverá exibir a atualização da listagem dos valores da tabela com os registros que correspondem. A funcionalidade também deve permitir **editar** os dados de um paciente já cadastrado, salvando a alteração no banco de dados.
- A funcionalidade de **dentistas** deve permitir cadastrar um novo **dentista** contendo o CRO (Conselho Regional de Odontologia), nome e especialidade, também listar os dentistas cadastrados.
- A funcionalidade de **agendamento** deve exibir: Listagem dos agendamentos cadastrados ordenado por dia de agendamento, trazendo todos dados do paciente e do dentista. A funcionalidade também deve permitir atualizar a data de um agendamento já cadastrado e exclusão, salvando a alteração no banco de dados.

### Desafio
Você, como desenvolvedor deverá criar um sistema que permita o cadastro e gerenciamento de pacientes,
dentistas e agendamentos, com autenticação de usuários e controle seguro de dados.

### RESULTADOS E ENTREGAS ESPERADAS                                                                          
Um **repositório privado do github com o instrutor como colaborador** nomeado com **`seu_nome_completo_saep_2026`**, contendo os seguintes arquivos:

|Nº|Entrega|Tipo de Entrega|Tempo<br>estimado<br>(minutos)|
|-|:-:|:-:|:-:|
|1|Documentação de software<br>Requisitos funcionais e não funcionais numerados|./docs/<br>documentacao.pdf<br>ou documentacao.md|15|
|2|Diagrama Entidade Relacionamento|der.png ou der.pdf|5|
|3|Script de criação e de população do banco de dados|./docs/<br>script.sql<br>ou ./api/prisma/<br>schema.prisma e seed.js|20|
|4|Códigos fonte da funcionalidade de **login**|./api/src/ e ./web/|20|
|5|Códigos fonte da funcionalidade **principal do sistema**|./web/|20|
|6|Códigos fonte da funcionalidade do **gerenciamento do paciente**|./api/src/ e ./web/|30|
|7|Códigos fonte da funcionalidade do **gerenciamento do dentista**|./api/src/ e ./web/|30|
|8|Códigos fonte da funcionalidade do **gerenciamento de agendamento**|./api/src/ e ./web/|40|

#### Totalizando 3h de desenvolvimento.
Boas prática recomendadas:
- Leia e entenda as demandas antes de iniciar
- Crie o repositório no início do projeto e siga com **commits** constantes.
- Desenvolva a documentação e diagramas inicialmente ou *schema* no ORM já populando com dados de teste *seed*
- Implemente o back-end e faça testes iniciais com **insomnia**, **postman** ou outra ferramenta de testes.
- Implemente a UI(User Interface) WEB responsiva.
- Faça testes unitários e de integração durante os processos.