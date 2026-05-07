// ========================================
// 1. リアルタイムプレビュー機能
// ========================================

document.getElementById('movie-form').addEventListener('input', updatePreview);

//背景画像のURLを定義
const backgroundImages = {
    black: { type: 'color', value: '#000000' },
    brown: { type: 'color', value: '#866347' },
    pink: { type: 'color', value: '#ffabd2' },
    blue: { type: 'color', value: '#1692f7' },
    green: { type: 'color', value: '#81e085' },
    red: { type: 'color', value: '#ff5858' },
    purple: { type: 'color', value: '#b775ee' },
    yellow: { type: 'color', value: '#fff134' },
    orangi: { type: 'color', value: '#ffad50' },
    gray: { type: 'color', value: '#949494' },
    image1: { type: 'image', value: 'images/DotBg.png' },
    image2: { type: 'image', value: 'images/CheckBg.png' },
    image3: { type: 'image', value: 'images/RetroBg.png' },
    image4: { type: 'image', value: 'images/NeonBg.png' },
};

//カスタム背景画像のデータ
let customBackgroundData = null;

//背景選択時の処理
document.getElementById('background').addEventListener('change', function() {
    const customField = document.getElementById('custom-background-field');

    if (this.value === 'custom') {
        //「じぶんのがぞう」を選択した場合は表示
        customField.style.display = 'block';
    } else {
        //それ以外は非表示
        customField.style.display = 'none';
    }

    updatePreview();
});

//カスタム背景画像アップロード時の処理
document.getElementById('custom-background').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            customBackgroundData = event.target.result;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
});

//updatePreview関数
function updatePreview() {
    //各入力値を取得
    const genre = document.getElementById('genre').value;
    const title = document.getElementById('title').value;
    const synopsis = document.getElementById('synopsis').value;
    const recommend = document.getElementById('recommend').value;
    const myname = document.getElementById('myname').value;
    const background = document.getElementById('background').value;

    //チェックされたタグを取得
    const tags = [];
    document.querySelectorAll('.nes-checkbox:checked').forEach(checkbox => {
        tags.push(checkbox.value);
    });

    //プレビューエリアを取得
    const preview = document.getElementById('preview');

    //入力が無い場合は初期メッセージを表示
    if (!genre && !title && !synopsis && !recommend && tags.length === 0) {
        preview.innerHTML = '<p class="nes-text is-disabled" style="color: #999999;">ぷれいびゅーがひょうじされるよ！▼</p>';
        return;
    }

    //名前の表示用テキストを作成（入力がなければ「ぼく」）
    const displayName = myname ? escapeHtml(myname) : 'ぼく';

    //背景のスタイルを決定（デフォルト値は空にする）
    let backgroundStyle = '';

    //背景のスタイルを決定（ユーザー選択）
    if (background === 'custom' && customBackgroundData) {
        //カスタム画像の場合
        backgroundStyle = `background-image: url(${customBackgroundData}); background-size: cover; background-position: center;`; 
    } else if (background && backgroundImages[background]) {
        const bgConfig = backgroundImages[background];
        //デバックログ
        console.log('選択された背景:', background);
        console.log('背景の値:', bgConfig.value);
        if (bgConfig.type === 'color') {
            //単色の場合
            backgroundStyle = `background-color: ${bgConfig.value};`;
        } else if (bgConfig.type === 'image') {
            //テンプレート画像の場合
            backgroundStyle = `background-image: url("${bgConfig.value}"); background-size: auto; background-repeat: repeat; background-position: center;`;
        }
    }

    console.log("最終的な背景のスタイル:", backgroundStyle);

    //プレビュー用のHTMLを生成（ゲーム風デザイン）
    preview.innerHTML = `
        <div style="font-family: 'Press Start 2P', 'DotGothic16', cursive; color: #212529; padding: 20px; ${backgroundStyle} border: 4px solid #000; border-radius: 0px; box-shadow: 8px 8px 0px rgba(0,0,0,0.3); min-height: 300px;">

            <!--タイトル部分-->
            <div style="background: #000000; color: #fff; padding: 10px; margin: -20px -20px 15px -20px; text-align: center;">
                <h2 style="font-size: 16px; margin: 0;">
                    <span style="color: #fff;">${displayName}</span>のれぽーと
                </h2>
            </div>

            <!--上部エリア（画像＋基本情報）-->
            <div style="display: flex; gap: 15px; margin-bottom: 15px;">

                <!--画像表示（アップロードされた画像）-->
                ${uploadedImageData ? `
                    <div style="flex-shrink: 0; width: 180px; border: 3px solid #000; background:#fff; padding: 5px;">
                        <img src="${uploadedImageData}"
                           style="width: 100%; height: auto; display: block;">
                    </div>
                ` : `
                    <div style="flex-shrink: 0; width: 180px; border: 3px solid #000; background: #fff; padding: 5px;">
                        <img src="images/TemplateRm2.png"
                            style="width: 100%; height: auto; display: block;">
                    </div>
                `}                   

                <!--右側：タイトル、ジャンル、タグ-->
                <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">

                    <!--タイトル表示-->
                    ${title ? `
                        <div style="background: rgba(255, 255, 255, 0.7); border: 3px solid #000; padding: 8px;">
                            <p style="font-size: 10px; margin: 0;">
                                <span style="color: #222222;">たいとる：</span>${escapeHtml(title)}
                            </p>
                        </div>
                    ` : ''}

                    <!--ジャンル表示-->
                    ${genre ? `
                        <div style="background: rgba(255, 255, 255, 0.7); border: 3px solid #000; padding: 8px;">
                            <p style="font-size: 10px; margin: 0;">
                                <span style="color: #222222;">ぶんるい：</span>${getGenreText(genre)}
                            </p>
                        </div>
                    ` : ''}

                    <!--タグ表示-->
                    ${tags.length > 0 ? `
                        <div style="background-color: rgba(255, 255, 255, 0.7); border: 3px solid #000; padding: 8px;">
                            <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                                ${tags.map(tag => `<span style="background-color: #667eea; color: #fff; padding: 3px 8px; border-radius: 4px; font-size: 8px;">▼${escapeHtml(tag)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>  

            <!--あらすじ表示-->
            ${synopsis ? `
                <div style="background: rgba(255, 255, 255, 0.7); border: 3px solid #000; padding: 10px; margin-bottom: 10px;">
                    <p style="font-size: 10px; font-weight: bold; margin-bottom: 5px; color: #222222; text-align: left;">
                        あらすじ▼
                    </p>
                    <p style="font-size: 9px; line-height: 1.6; margin: 0; white-space: pre-wrap; text-align: left;">${escapeHtml(synopsis)}</p>
                </div>
            ` : ''}

            <!--ぼくのれぽーと-->
            ${recommend ? `
                <div style="background: rgba(255, 255, 255, 0.7); border: 3px solid #000; padding: 10px; margin-bottom: 10px;">
                    <p style="font-size: 10px; font-weight: bold; margin-bottom: 5px; color: #222222; text-align: left;">
                        <span style="color: #222222;">${displayName}</span>のれぽーと▼
                    </p>
                    <p style="font-size: 9px; line-height: 1.6; margin: 0; white-space: pre-wrap; text-align: left;">${escapeHtml(recommend)}</p>
                </div>
            ` : ''}
        </div>
    `;

    // ダウンロードボタンを表示
    document.getElementById('download-btn').style.display = 'inline-block';
}

//背景選択時にプレビューを更新
document.getElementById('background').addEventListener('change', updatePreview);

//ジャンルのテキスト変換
function getGenreText(genre) {
    const genreMap = {
        'anime': 'あにめ',
        'comic': 'まんが',
        'movie': 'えいが',
        'game': 'げえむ',
        'novel': 'しょうせつ'
    };
    return genreMap[genre] || genre;
}

//HTMLエスケープ（XSS対策）
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// 画像アップロード機能
// ========================================

let selectedImage = 'images/TemplateRm.png';
let uploadedImageData = null; //アップロードされた画像データを保持

//ボタンクリックでファイル選択を開く
document.getElementById('upload-btn').addEventListener('click',() => {
    document.getElementById('image-upload').click();
});

//ファイルが選択されたときの処理
document.getElementById('image-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return; 

    //ファイル名を表示
    document.getElementById('file-name').textContent = `せんたくされたがぞう: ${file.name}`;

    //画像を読み込む
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
            //リサイズ処理（オプション）
            uploadedImageData = resizeImage(img, 600, 400); //最大幅600px、高さ400px

            //プレビューを更新
            updatePreview();
        };
    };

    reader.readAsDataURL(file);
});


//画像をリサイズする関数
function resizeImage(img, maxWidth, maxHeight) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let width = img.width;
    let height = img.height;

    //アスペクト比を保ちながらリサイズ
    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
    }

    canvas.width = width;
    canvas.height = height;

    //Canvasに画像を描写
    ctx.drawImage(img, 0, 0, width, height);

    //Base64形式で返す
    return canvas.toDataURL('image/jpeg', 0.9);//JPEG形式、品質90%
}

// ========================================
// 2. 画像生成・ダウンロード機能
// ========================================

document.getElementById('generate-btn').addEventListener('click', generateImage);
document.getElementById('download-btn').addEventListener('click', downloadImage);

let generatedCanvas = null; //生成した画像を保存

//画像を生成
function generateImage() {
    const preview = document.getElementById('preview');

    //入力チェック
    const title = document.getElementById('title').value;
    if (!title) {
        alert('たいとるをにゅうりょくしてね！');
        return;
    }

    //html2canvasでプレビューを画像化
    html2canvas(preview, {
        backgroundColor: null,//背景を透過させる
        scale: 2,//高解像度
        logging: false
    }).then(canvas => {
        generatedCanvas = canvas;

        //プレビューエリアに画像を表示
        preview.innerHTML = '';
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        canvas.style.borderRadius = '8px';
        preview.appendChild(canvas);

        //ダウンロードボタンを表示
        document.getElementById('download-btn').style.display = 'inline-block';
        document.getElementById('share-x-btn').style.display = 'inline-block';

        alert('れぽーとがかんせいしたよ！「だうんろーど」でれぽーとをほぞんしよう！');
    });
}

//画像をダウンロード
function downloadImage() {
    if (!generatedCanvas) {
        alert('まずは「れぽーと」にかきのこそう！');
        return;
    }

    //Canvasを画像データに変換
    generatedCanvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ぼくのれぽーと.png';
        link.click();

        //メモリ解放
        URL.revokeObjectURL(url);
    });
}

// ========================================
// 3. Xシェア機能
// ========================================

document.getElementById('share-x-btn').addEventListener('click', shareToX);

function shareToX() {
    const title = document.getElementById('title').value;
    const genre = document.getElementById('genre').value;

    if (!title) {
        alert('たいとるをにゅうりょくしてね！');
        return;
    }

    //シェアするテキストを作成
    const text = `「${title}」のぼくれぽーとをかいたよ！\n\n#ぼくれぽーと #${getGenreText(genre)}`;

    //ｘのシェアＵＲＬを生成
    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;

    //新しいウィンドウでｘを開く
    window.open(shareUrl, '_blank', 'width=550,height=420');
}