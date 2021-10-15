var platform = detect.parse(navigator.userAgent)
var os_ = platform.os.family.toLowerCase()

document.getElementById('linux').addEventListener('click', selectLinuxDownloads)
document.getElementById('windows').addEventListener('click', selectWindowsDownloads)
document.getElementById('macos').addEventListener('click', selectMacosDownloads)

if(os_.includes('windows')) {
// windows
    selectWindowsDownloads()
}
else if(os_.includes('linux')) {
// linux
    selectLinuxDownloads()
}
else {
// macos
    selectMacosDownloads()
}

function selectLinuxDownloads() {
    document.getElementById('download-links').style.gridTemplateColumns = '2fr 1fr 1fr'
    document.getElementById('win-links').style.display = 'none'
    document.getElementById('macos-links').style.display = 'none'
    document.getElementById('linux-links').style.display = 'block'
    
    // adding active class
    document.getElementById('linux').classList.add('active-download-btn-container')
    document.getElementById('linux-icon').classList.add('active-download-icon')

    // removing active class from the rest
    document.getElementById('windows').classList.remove('active-download-btn-container')
    document.getElementById('windows-icon').classList.remove('active-download-icon')

    document.getElementById('macos').classList.remove('active-download-btn-container')
    document.getElementById('macos-icon').classList.remove('active-download-icon')
}

function selectWindowsDownloads() {
    document.getElementById('download-links').style.gridTemplateColumns = '1fr 2fr 1fr'
    document.getElementById('linux-links').style.display = 'none'
    document.getElementById('macos-links').style.display = 'none'
    document.getElementById('win-links').style.display = 'block'
    
    document.getElementById('windows').classList.add('active-download-btn-container')
    document.getElementById('windows-icon').classList.add('active-download-icon')

    // removing active class from the rest
    document.getElementById('linux').classList.remove('active-download-btn-container')
    document.getElementById('linux-icon').classList.remove('active-download-icon')

    document.getElementById('macos').classList.remove('active-download-btn-container')
    document.getElementById('macos-icon').classList.remove('active-download-icon')
}

function selectMacosDownloads() {
    document.getElementById('download-links').style.gridTemplateColumns = '1fr 1fr 2fr'
    document.getElementById('linux-links').style.display = 'none'
    document.getElementById('win-links').style.display = 'none'
    document.getElementById('macos-links').style.display = 'block'
    
    document.getElementById('macos').classList.add('active-download-btn-container')
    document.getElementById('macos-icon').classList.add('active-download-icon')

    // removing active class from the rest
    document.getElementById('linux').classList.remove('active-download-btn-container')
    document.getElementById('linux-icon').classList.remove('active-download-icon')

    document.getElementById('windows').classList.remove('active-download-btn-container')
    document.getElementById('windows-icon').classList.remove('active-download-icon')
}