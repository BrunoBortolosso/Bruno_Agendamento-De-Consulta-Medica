class Consulta {
    constructor(paciente, medico, data) {
        this.paciente = paciente;
        this.medico = medico;
        this.data = data;
        this.status = "Agendada";
    }

    verificarUrgencia() {
        const hoje = new Date();
        const dataConsulta = new Date(this.data);
        const diffDias = (dataConsulta - hoje) / (1000 * 60 * 60 * 24);
        return diffDias <= 1 ? "Urgente" : "Normal";
    }

    exibirDetalhes() {
        return `
            <div class="consulta">
                <p><strong>Paciente:</strong> ${this.paciente}</p>
                <p><strong>Médico:</strong> ${this.medico}</p>
                <p><strong>Data:</strong> ${this.data}</p>
                <p><strong>Status:</strong> ${this.status}</p>
                <p><strong>Urgência:</strong> ${this.verificarUrgencia()}</p>
            </div>
        `;
    }
}

class ConsultaOnline extends Consulta {
    constructor(paciente, medico, data, link) {
        super(paciente, medico, data);
        this.link = link;
    }

    exibirDetalhes() {
        return `
            <div class="consulta">
                <p><strong>Paciente:</strong> ${this.paciente}</p>
                <p><strong>Médico:</strong> ${this.medico}</p>
                <p><strong>Data:</strong> ${this.data}</p>
                <p><strong>Status:</strong> ${this.status}</p>
                <p><strong>Urgência:</strong> ${this.verificarUrgencia()}</p>
                <p><strong>Link:</strong> <a href="${this.link}" target="_blank">Abrir Consulta</a></p>
            </div>
        `;
    }
}

const form = document.getElementById("consulta-form");
const lista = document.getElementById("lista-consultas");
const consultas = [];

form.addEventListener("submit", (e)
