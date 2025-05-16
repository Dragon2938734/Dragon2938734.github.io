// 配置文件的URL
const CONFIG_URL = 'config.json';

// 社交媒体图标映射
const SOCIAL_ICONS = {
    email: 'fas fa-envelope',
    github: 'fab fa-github',
    linkedin: 'fab fa-linkedin',
    googleScholar: 'fas fa-graduation-cap'
};

// 主函数
async function initializePage() {
    try {
        const config = await fetchConfig();
        updatePageContent(config);
    } catch (error) {
        console.error('加载配置文件时出错:', error);
        showError('配置文件加载失败。请检查 config.json 文件是否存在且格式正确。');
    }
}

// 获取配置文件
async function fetchConfig() {
    const timestamp = new Date().getTime();
    const response = await fetch(`${CONFIG_URL}?t=${timestamp}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// 更新页面内容
function updatePageContent(config) {
    updateBasicInfo(config.basicInfo);
    updateIntroduction(config.introduction);
    updateExperiences(config.experiences);
    updatePublications(config.publications);
    updateProjects(config.projects);
    updateCurrentYear();
}

// 更新基本信息
function updateBasicInfo(basicInfo) {
    document.getElementById('nav-name').textContent = basicInfo.name;
    document.getElementById('name').textContent = basicInfo.name;
    
    // 更新个人照片
    if (basicInfo.profileImage) {
        document.getElementById('profile-image').src = basicInfo.profileImage;
    }
    
    const affiliationText = `${basicInfo.affiliation.department ? basicInfo.affiliation.department + ', ' : ''}${basicInfo.affiliation.institution}`;
    document.getElementById('affiliation').textContent = affiliationText;

    const contactInfo = document.getElementById('contact-info');
    contactInfo.innerHTML = '';

    // 添加社交媒体链接
    Object.entries(basicInfo).forEach(([key, value]) => {
        if (SOCIAL_ICONS[key] && value) {
            const link = document.createElement('a');
            link.href = key === 'email' ? `mailto:${value}` : value;
            link.target = key === 'email' ? '' : '_blank';
            link.rel = 'noopener noreferrer';
            link.innerHTML = `<i class="${SOCIAL_ICONS[key]}"></i>`;
            link.title = key.charAt(0).toUpperCase() + key.slice(1);
            contactInfo.appendChild(link);
        }
    });
}

// 更新个人介绍
function updateIntroduction(introduction) {
    const introDiv = document.getElementById('introduction');
    introDiv.innerHTML = '';
    
    // 更新标题
    const titleElement = document.querySelector('#about h2');
    if (titleElement && introduction.title) {
        titleElement.textContent = introduction.title;
    }
    
    introduction.content.forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        p.classList.add('fade-in');
        introDiv.appendChild(p);
    });
}

// 更新经历
function updateExperiences(experiences) {
    const experienceList = document.getElementById('experience-list');
    experienceList.innerHTML = '';

    // 更新标题
    const titleElement = document.querySelector('#experiences h2');
    if (titleElement && experiences.title) {
        titleElement.textContent = experiences.title;
    }

    experiences.entries.forEach(exp => {
        const card = document.createElement('div');
        card.className = 'experience-card fade-in';
        
        card.innerHTML = `
            <h3>${exp.role}</h3>
            <div class="experience-meta">
                <span>${exp.company}</span> | 
                <span>${exp.location}</span> | 
                <span>${exp.duration}</span>
            </div>
            <ul>
                ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
            </ul>
        `;
        
        experienceList.appendChild(card);
    });
}

// 更新发表
function updatePublications(publications) {
    const publicationList = document.getElementById('publication-list');
    publicationList.innerHTML = '';

    // 更新标题
    const titleElement = document.querySelector('#publications h2');
    if (titleElement && publications.title) {
        titleElement.textContent = publications.title;
    }

    publications.entries.forEach(pub => {
        const card = document.createElement('div');
        card.className = 'publication-card fade-in';
        
        card.innerHTML = `
            <h3>${pub.title}</h3>
            <div class="publication-authors">${pub.authors.join(', ')}</div>
            <div class="publication-meta">${pub.venue} (${pub.year})</div>
            <div class="publication-links">
                ${pub.link ? `<a href="${pub.link}" target="_blank" rel="noopener noreferrer"><i class="fas fa-file-pdf"></i> PDF</a>` : ''}
                ${pub.abstractLink ? `<a href="${pub.abstractLink}" target="_blank" rel="noopener noreferrer"><i class="fas fa-align-left"></i> 摘要</a>` : ''}
                ${pub.codeLink ? `<a href="${pub.codeLink}" target="_blank" rel="noopener noreferrer"><i class="fas fa-code"></i> 代码</a>` : ''}
            </div>
        `;
        
        publicationList.appendChild(card);
    });
}

// 更新项目
function updateProjects(projects) {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = '';

    // 更新标题
    const titleElement = document.querySelector('#projects h2');
    if (titleElement && projects.title) {
        titleElement.textContent = projects.title;
    }

    projects.entries.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card fade-in';
        
        card.innerHTML = `
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <div class="tech-tags">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="publication-links">
                ${project.repoLink ? `<a href="${project.repoLink}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> 代码仓库</a>` : ''}
                ${project.demoLink ? `<a href="${project.demoLink}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> 演示</a>` : ''}
            </div>
        `;
        
        projectList.appendChild(card);
    });
}

// 更新年份
function updateCurrentYear() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
}

// 显示错误信息
function showError(message) {
    const main = document.querySelector('main');
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        background-color: #fee;
        color: #c00;
        padding: 20px;
        margin: 20px;
        border-radius: 4px;
        text-align: center;
    `;
    errorDiv.textContent = message;
    main.insertBefore(errorDiv, main.firstChild);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializePage); 