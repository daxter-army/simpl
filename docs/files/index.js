var platform = detect.parse(navigator.userAgent);
var os_ = platform.os.family.toLowerCase()

if(os_.includes('windows')) {
// windows
document.getElementById('download-links').style.gridTemplateColumns = '1fr 2fr 1fr'
document.getElementById('linux-btn').style.display = 'none'
document.getElementById('macos-btn').style.display = 'none'

document.getElementById('windows').classList.add('active-download-btn-container')
document.getElementById('windows-icon').classList.add('active-download-icon')
}
else if(os_.includes('linux')) {
// linux
document.getElementById('download-links').style.gridTemplateColumns = '2fr 1fr 1fr'
document.getElementById('windows-btn').style.display = 'none'
document.getElementById('macos-btn').style.display = 'none'

document.getElementById('linux').classList.add('active-download-btn-container')
document.getElementById('linux-icon').classList.add('active-download-icon')
}
else {
// macos
document.getElementById('download-links').style.gridTemplateColumns = '1fr 1fr 2fr'
document.getElementById('linux-btn').style.display = 'none'
document.getElementById('windows-btn').style.display = 'none'

document.getElementById('macos').classList.add('active-download-btn-container')
document.getElementById('macos-icon').classList.add('active-download-icon')
}