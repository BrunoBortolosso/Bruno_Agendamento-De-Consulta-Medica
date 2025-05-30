import mysql.connector
from datetime import datetime

# Conexão com o banco de dados MySQL (XAMPP)
def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",  # Adicione sua senha se tiver configurado
        database="consultas_db"
    )

# Classes
class Consulta:
    def __init__(self, paciente, medico, data):
        self.paciente = paciente
        self.medico = medico
        self.data = data
        self.__status = "Agendada"

    def get_status(self):
        return self.__status

    def set_status(self, novo_status):
        if novo_status in ["Agendada", "Confirmada", "Cancelada"]:
            self.__status = novo_status
        else:
            print("Status inválido.")

    def verificar_urgencia(self):
        hoje = datetime.now().date()
        data_consulta = datetime.strptime(self.data, "%Y-%m-%d").date()
        dias = (data_consulta - hoje).days
        return "Urgente" if dias <= 1 else "Normal"

    def exibir_detalhes(self):
        print(f"Paciente: {self.paciente}")
        print(f"Médico: {self.medico}")
        print(f"Data: {self.data}")
        print(f"Status: {self.__status}")
        print(f"Urgência: {self.verificar_urgencia()}")

class ConsultaOnline(Consulta):
    def __init__(self, paciente, medico, data, link):
        super().__init__(paciente, medico, data)
        self.link = link

    def exibir_detalhes(self):
        super().exibir_detalhes()
        print(f"Link da consulta: {self.link}")

# Funções de banco de dados
def salvar_consulta(consulta):
    conexao = conectar()
    cursor = conexao.cursor()
    cursor.execute("""
        INSERT INTO consultas (paciente, medico, data, status) 
        VALUES (%s, %s, %s, %s)
    """, (consulta.paciente, consulta.medico, consulta.data, consulta.get_status()))
    conexao.commit()
    conexao.close()

def mostrar_consultas():
    conexao = conectar()
    cursor = conexao.cursor()
    cursor.execute("SELECT * FROM consultas")
    dados = cursor.fetchall()
    for linha in dados:
        print(f"ID: {linha[0]} | Paciente: {linha[1]} | Médico: {linha[2]} | Data: {linha[3]} | Status: {linha[4]}")
    conexao.close()

def deletar_consulta(id_consulta):
    conexao = conectar()
    cursor = conexao.cursor()
    cursor.execute("DELETE FROM consultas WHERE id = %s", (id_consulta,))
    conexao.commit()
    conexao.close()

def atualizar_consulta(id_consulta, campo, novo_valor):
    if campo not in ["paciente", "medico", "data", "status"]:
        print("Campo inválido.")
        return
    conexao = conectar()
    cursor = conexao.cursor()
    sql = f"UPDATE consultas SET {campo} = %s WHERE id = %s"
    cursor.execute(sql, (novo_valor, id_consulta))
    conexao.commit()
    conexao.close()

# Menu interativo
def menu():
    while True:
        print("\n=== MENU ===")
        print("1. Cadastrar nova consulta")
        print("2. Cadastrar nova consulta online")
        print("3. Listar todas as consultas")
        print("4. Editar uma consulta")
        print("5. Deletar uma consulta")
        print("0. Sair")

        opcao = input("Escolha uma opção: ")

        if opcao == "1":
            paciente = input("Nome do paciente: ")
            medico = input("Nome do médico: ")
            data = input("Data da consulta (YYYY-MM-DD): ")
            consulta = Consulta(paciente, medico, data)
            status = input("Status (Agendada, Confirmada, Cancelada): ")
            consulta.set_status(status)
            salvar_consulta(consulta)
            print("Consulta salva com sucesso.")

        elif opcao == "2":
            paciente = input("Nome do paciente: ")
            medico = input("Nome do médico: ")
            data = input("Data da consulta (YYYY-MM-DD): ")
            link = input("Link da consulta: ")
            consulta = ConsultaOnline(paciente, medico, data, link)
            status = input("Status (Agendada, Confirmada, Cancelada): ")
            consulta.set_status(status)
            salvar_consulta(consulta)
            print("Consulta online salva com sucesso.")

        elif opcao == "3":
            print("\nConsultas cadastradas:")
            mostrar_consultas()

        elif opcao == "4":
            mostrar_consultas()
            id_editar = input("Digite o ID da consulta a editar: ")
            print("Campos: paciente | medico | data | status")
            campo = input("Qual campo deseja editar? ")
            novo_valor = input("Digite o novo valor: ")
            atualizar_consulta(id_editar, campo, novo_valor)
            print("Consulta atualizada.")

        elif opcao == "5":
            mostrar_consultas()
            id_excluir = input("Digite o ID da consulta a excluir: ")
            deletar_consulta(id_excluir)
            print("Consulta deletada.")

        elif opcao == "0":
            print("Saindo do programa...")
            break

        else:
            print("Opção inválida. Tente novamente.")

# Executar menu
menu()
