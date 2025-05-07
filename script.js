// Array para armazenar os horários ocupados
let horariosOcupados = [];

// Senha administrativa (em um caso real, isso deveria ser armazenado de forma segura)
const SENHA_ADMIN = "l3o123";

// Função para gerar os horários disponíveis
function gerarHorarios() {
    const horariosGrid = document.getElementById('horariosGrid');
    horariosGrid.innerHTML = '';
    
    for (let hora = 9; hora <= 20; hora++) {
        const horario = `${hora.toString().padStart(2, '0')}:00`;
        const bloco = document.createElement('div');
        bloco.className = 'horario-bloco';
        if (horariosOcupados.includes(horario)) {
            bloco.className += ' ocupado';
        }
        bloco.textContent = horario;
        bloco.dataset.horario = horario;
        
        bloco.addEventListener('click', function() {
            if (!horariosOcupados.includes(horario)) {
                // Remove seleção anterior
                const blocosSelecionados = document.querySelectorAll('.horario-bloco.selecionado');
                blocosSelecionados.forEach(b => b.classList.remove('selecionado'));
                
                // Seleciona o novo horário
                this.classList.add('selecionado');
                document.getElementById('horarioSelecionado').value = horario;
            }
        });
        
        horariosGrid.appendChild(bloco);
    }
}

// Função para atualizar a lista de horários ocupados
function atualizarHorariosOcupados() {
    const container = document.getElementById('horariosOcupadosList');
    container.innerHTML = '';
    
    horariosOcupados.forEach(horario => {
        const item = document.createElement('div');
        item.className = 'horario-ocupado-item';
        item.innerHTML = `
            <span>${horario}</span>
            <button onclick="liberarHorario('${horario}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(item);
    });
}

// Função para liberar um horário
function liberarHorario(horario) {
    horariosOcupados = horariosOcupados.filter(h => h !== horario);
    atualizarHorariosOcupados();
    gerarHorarios(); // Atualiza a grade de horários disponíveis
}

// Função para detectar dispositivos móveis
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf("IEMobile") !== -1);
}

// Função para formatar o número do WhatsApp
function formatarNumeroWhatsApp(numero) {
    // Remove todos os caracteres não numéricos
    return numero.replace(/\D/g, '');
}

// Função para enviar mensagem para o WhatsApp
function enviarWhatsApp(nome, contato, horario) {
    const numero = formatarNumeroWhatsApp('554799199993');
    const mensagem = `*AGENDAMENTO*%0A%0ANome: ${nome}%0AContato: ${contato}%0AHorário: ${horario}`;
    
    // URL base para WhatsApp
    let url = '';
    
    if (isMobileDevice()) {
        // Para dispositivos móveis
        url = `https://api.whatsapp.com/send?phone=${numero}&text=${mensagem}`;
    } else {
        // Para desktop
        url = `https://web.whatsapp.com/send?phone=${numero}&text=${mensagem}`;
    }
    
    // Abre em uma nova janela
    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const agendarBtn = document.getElementById('agendarBtn');
    const closeBtn = document.querySelector('.close');
    const body = document.body;

    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('modal').style.display = 'none';
        document.getElementById('adminModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    

    // Abrir modal
    agendarBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
        body.style.overflow = 'hidden'; // Previne rolagem da página
        gerarHorarios();
    });

    // Fechar modal
    closeBtn.addEventListener('click', function() {
        closeModal();
    });

    // Fechar modal ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Função para fechar o modal
    function closeModal() {
        modal.style.display = 'none';
        body.style.overflow = 'auto'; // Restaura rolagem da página
    }

    // Prevenir fechamento ao clicar no conteúdo do modal
    modal.querySelector('.modal-content').addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Fechar modal com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });

    // Manipular envio do formulário
    const form = document.getElementById('agendamentoForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const contato = document.getElementById('contato').value;
        const horario = document.getElementById('horarioSelecionado').value;
        
        if (!horario) {
            alert('Por favor, selecione um horário');
            return;
        }
        
        // Adicionar o horário aos ocupados
        horariosOcupados.push(horario);
        
        // Enviar para o WhatsApp usando a nova função
        enviarWhatsApp(nome, contato, horario);
        
        closeModal();
        form.reset();
    });

    // Gerenciamento do modal administrativo
    const adminModal = document.getElementById('adminModal');
    const adminBtn = document.getElementById('adminBtn');
    const loginForm = document.getElementById('loginForm');
    const adminLogin = document.getElementById('adminLogin');
    const adminPanel = document.getElementById('adminPanel');
    const logoutBtn = document.getElementById('logoutBtn');

    // Abrir modal administrativo
    adminBtn.addEventListener('click', function() {
        adminModal.style.display = 'flex';
        adminLogin.style.display = 'block';
        adminPanel.style.display = 'none';
    });

    // Fechar modal administrativo
    adminModal.querySelector('.close').addEventListener('click', function() {
        adminModal.style.display = 'none';
    });

    // Login administrativo
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const senha = document.getElementById('senha').value;
        
        if (senha === SENHA_ADMIN) {
            adminLogin.style.display = 'none';
            adminPanel.style.display = 'block';
            atualizarHorariosOcupados();
        } else {
            alert('Senha incorreta!');
        }
        
        loginForm.reset();
    });

    // Logout
    logoutBtn.addEventListener('click', function() {
        adminLogin.style.display = 'block';
        adminPanel.style.display = 'none';
        adminModal.style.display = 'none';
    });

    // Fechar modal ao clicar fora
    adminModal.addEventListener('click', function(e) {
        if (e.target === adminModal) {
            adminModal.style.display = 'none';
        }
    });
}); 