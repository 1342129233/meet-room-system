import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';

interface ImageUploaderProps {
    onChange?: (value: string) => void;
    fileList?: string;
}

let onChange: Function;

export const ImageUploader= (props: ImageUploaderProps) => {
    onChange = props.onChange!
    const currentDomain = window.location.hostname;
    const flag = useRef<boolean>(true);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    useEffect(() => {
        if(props.fileList && flag.current) {
            setFileList([
                {
                    uid: '0',
                    name: '5xha7azys9654ja.png',
                    status: 'done',
                    url: `http://${currentDomain}:9000/uploads/1718970890273-540200103-5xha7azys9654ja.png`
                } 
            ])
            flag.current = false;
        }
    }, [props.fileList]);

    const handleChange: UploadProps['onChange'] = ({ file, fileList }) => {
        setFileList(fileList)
        if (file.status === 'done') {
            if(file.response.code === 201) {
                onChange(file.response.data || '')
            }
        }
    }   

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传图片</div>
        </button>
    );
    return (
        <>
            <Upload
                action="http://localhost:9000/upload/picture"
                listType="picture-card"
                fileList={fileList}
                multiple={false}
                onChange={handleChange}
            >
                {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};


